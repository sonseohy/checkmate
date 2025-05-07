package com.checkmate.global.common.service;

import com.checkmate.global.util.CustomMultipartFile;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.SecureRandom;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {
    private final S3Client s3Client;
    private final AesFileEncryptionService aesService;
    private final KeyShareMongoService keyShareMongo;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${aws.s3.bucket}")
    private String bucketName;
    private String filePrefix;

    public static final String ORIGINAL_PREFIX = "original/";
    public static final String PDF_PREFIX      = "pdf/";

    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int    IV_LEN         = 12;
    private static final int    TAG_BITS       = 128;

    @PostConstruct
    public void init() {
        this.filePrefix = "https://" + bucketName + ".s3.ap-northeast-2.amazonaws.com/";
    }

    // ----------------------------------------------------
    // 1. AES-GCM + 2-of-2 키 분할 업로드
    // ----------------------------------------------------

    @Getter
    public static class SplitEncryptedResult {
        private final String url;
        private final byte[] iv;
        private final byte[] shareA;
        private final byte[] shareB;
        public SplitEncryptedResult(String url, byte[] iv, byte[] shareA, byte[] shareB) {
            this.url    = url;
            this.iv     = iv;
            this.shareA = shareA;
            this.shareB = shareB;
        }
    }

    /**
     * MultipartFile을 AES-GCM 암호화 → S3 업로드,
     * DEK를 랜덤 shareA/ shareB로 2-of-2 분할하여 반환.
     */
    public SplitEncryptedResult uploadEncryptedFileWithKeySplit(
            MultipartFile file,
            String prefix
    ) {
        try {
            byte[] plain = file.getBytes();

            // 1) DEK 생성
            KeyGenerator kg = KeyGenerator.getInstance("AES");
            kg.init(256);
            SecretKey dek = kg.generateKey();
            byte[] dekBytes = dek.getEncoded();

            // 2) XOR 분할
            byte[] shareA = new byte[dekBytes.length];
            secureRandom.nextBytes(shareA);
            byte[] shareB = new byte[dekBytes.length];
            for (int i = 0; i < dekBytes.length; i++) {
                shareB[i] = (byte)(dekBytes[i] ^ shareA[i]);
            }

            // 3) AES-GCM 암호화
            byte[] iv = new byte[IV_LEN];
            secureRandom.nextBytes(iv);
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE,
                    new SecretKeySpec(dekBytes, "AES"),
                    new GCMParameterSpec(TAG_BITS, iv));
            byte[] ciphertext = cipher.doFinal(plain);

            // 4) S3 업로드
            String ext  = StringUtils.getFilenameExtension(file.getOriginalFilename());
            String key  = prefix + UUID.randomUUID() + System.currentTimeMillis() + "." + ext;
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromBytes(ciphertext)
            );
            String url = filePrefix + key;

            return new SplitEncryptedResult(url, iv, shareA, shareB);
        } catch (Exception e) {
            throw new RuntimeException("암호화 분할 업로드 실패", e);
        }
    }

    /**
     * byte[]을 AES-GCM 암호화 → S3 업로드,
     * DEK를 shareA/ shareB로 2-of-2 분할하여 반환.
     */
    public SplitEncryptedResult uploadEncryptedBytesWithKeySplit(
            byte[] data,
            String fileName,
            String contentType,
            String prefix
    ) {
        try {
            // 1) DEK 생성
            KeyGenerator kg = KeyGenerator.getInstance("AES");
            kg.init(256);
            SecretKey dek = kg.generateKey();
            byte[] dekBytes = dek.getEncoded();

            // 2) XOR 분할
            byte[] shareA = new byte[dekBytes.length];
            secureRandom.nextBytes(shareA);
            byte[] shareB = new byte[dekBytes.length];
            for (int i = 0; i < dekBytes.length; i++) {
                shareB[i] = (byte)(dekBytes[i] ^ shareA[i]);
            }

            // 3) AES-GCM 암호화
            byte[] iv = new byte[IV_LEN];
            secureRandom.nextBytes(iv);
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE,
                    new SecretKeySpec(dekBytes, "AES"),
                    new GCMParameterSpec(TAG_BITS, iv));
            byte[] ciphertext = cipher.doFinal(data);

            // 4) S3 업로드
            String extension = fileName.contains(".")
                    ? fileName.substring(fileName.lastIndexOf("."))
                    : "";
            String key = prefix + UUID.randomUUID() + System.currentTimeMillis() + extension;
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .contentType(contentType)
                            .build(),
                    RequestBody.fromBytes(ciphertext)
            );
            String url = filePrefix + key;

            return new SplitEncryptedResult(url, iv, shareA, shareB);
        } catch (Exception e) {
            throw new RuntimeException("암호화 바이트 분할 업로드 실패", e);
        }
    }

    /**
     * S3에서 암호문을 가져와,
     * shareA(mysql)와 shareB(mongo)로 DEK 복원 → 평문 반환
     */
    public byte[] downloadAndDecryptWithKeySplit(
            String fileUrl,
            byte[] iv,
            byte[] shareA,
            Long fileId
    ) {
        try {
            // S3 다운로드
            String key = fileUrl.replace(filePrefix, "");
            ResponseBytes<GetObjectResponse> resp = s3Client.getObjectAsBytes(
                    GetObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .build());
            byte[] ciphertext = resp.asByteArray();

            // MongoDB에서 shareB 로드
            byte[] shareB = keyShareMongo.loadShareB(fileId);

            // DEK 복원
            byte[] dekBytes = new byte[shareA.length];
            for (int i = 0; i < shareA.length; i++) {
                dekBytes[i] = (byte)(shareA[i] ^ shareB[i]);
            }

            // AES-GCM 복호화
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE,
                    new SecretKeySpec(dekBytes, "AES"),
                    new GCMParameterSpec(TAG_BITS, iv));
            return cipher.doFinal(ciphertext);
        } catch (Exception e) {
            throw new RuntimeException("분할 복호화 실패", e);
        }
    }

    // ----------------------------------------------------
    // 2. 기존 메서드 (암호화 없이 업로드/다운로드 등)
    // ----------------------------------------------------

    public String uploadFile(MultipartFile file, String prefix) {
        String ext  = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String uuid = UUID.randomUUID().toString();
        String key  = prefix + uuid + System.currentTimeMillis() + "." + ext;
        PutObjectRequest req = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();
        try (InputStream in = file.getInputStream()) {
            PutObjectResponse resp = s3Client.putObject(req,
                    RequestBody.fromInputStream(in, file.getSize()));
            if (!resp.sdkHttpResponse().isSuccessful()) {
                throw new RuntimeException("파일 업로드 실패");
            }
            return filePrefix + key;
        } catch (IOException e) {
            throw new RuntimeException("파일 IO 에러", e);
        }
    }

    public String uploadBytes(byte[] bytes, String fileName, String contentType, String prefix) {
        String uuid      = UUID.randomUUID().toString();
        String extension = fileName.contains(".")
                ? fileName.substring(fileName.lastIndexOf("."))
                : "";
        String key = prefix + uuid + System.currentTimeMillis() + extension;
        PutObjectRequest req = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(contentType)
                .build();
        PutObjectResponse resp = s3Client.putObject(req,
                RequestBody.fromBytes(bytes));
        if (!resp.sdkHttpResponse().isSuccessful()) {
            throw new RuntimeException("파일 업로드 실패");
        }
        return filePrefix + key;
    }

    public byte[] downloadAndDecrypt(String fileUrl, byte[] iv) {
        String key = fileUrl.replace(filePrefix, "");
        ResponseBytes<GetObjectResponse> resp = s3Client.getObjectAsBytes(
                GetObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build());
        return aesService.decrypt(resp.asByteArray(), iv);
    }

    public void deleteFile(String fileUrl) {
        String key = fileUrl.replace(filePrefix, "");
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build());
        } catch (AwsServiceException e) {
            throw new RuntimeException("파일 삭제 실패", e);
        }
    }

    public byte[] getFileAsBytes(String fileUrl) {
        String key = fileUrl.replace(filePrefix, "");
        try (ResponseInputStream<GetObjectResponse> s3obj =
                     s3Client.getObject(GetObjectRequest.builder()
                             .bucket(bucketName)
                             .key(key)
                             .build());
             ByteArrayOutputStream buf = new ByteArrayOutputStream()) {

            byte[] tmp = new byte[1024];
            int    r;
            while ((r = s3obj.read(tmp)) != -1) {
                buf.write(tmp, 0, r);
            }
            return buf.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("파일 다운로드 실패", e);
        }
    }

    public MultipartFile getFileAsMultipartFile(String fileUrl, String contentType) {
        byte[] bytes = getFileAsBytes(fileUrl);
        String name  = fileUrl.replace(filePrefix, "")
                .substring(fileUrl.lastIndexOf("/") + 1);
        return new CustomMultipartFile(bytes, name, contentType);
    }
}
