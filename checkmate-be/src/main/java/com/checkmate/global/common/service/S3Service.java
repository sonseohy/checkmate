package com.checkmate.global.common.service;

import com.checkmate.global.util.CustomMultipartFile;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {
    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    private String filePrefix;

    // 파일 경로 상수 정의 - 단순화
    public static final String ORIGINAL_PREFIX = "original/";
    public static final String PDF_PREFIX = "pdf/";

    @PostConstruct
    public void init() {
        filePrefix = "https://" + bucketName + ".s3.ap-northeast-2.amazonaws.com/";
    }

    /**
     * 파일 업로드 메서드 - prefix를 사용하여 폴더 구조 생성
     */
    public String uploadFile(MultipartFile file, String prefix) {
        String filenameExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String uuid = UUID.randomUUID().toString();

        // prefix + UUID + 시간값 + .확장자
        String fileName = prefix + uuid + System.currentTimeMillis() + "." + filenameExtension;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(file.getContentType())
                .build();

        try (InputStream inputStream = file.getInputStream()) {
            PutObjectResponse response = s3Client.putObject(putObjectRequest,
                    software.amazon.awssdk.core.sync.RequestBody.fromInputStream(inputStream, file.getSize()));

            if (response.sdkHttpResponse().isSuccessful()) {
                log.info("파일 업로드 성공: {}", fileName);
                return filePrefix + fileName;
            } else {
                log.error("파일 업로드 실패: {}", fileName);
                throw new RuntimeException("파일 업로드 실패");
            }
        } catch (IOException e) {
            log.error("파일 업로드 IO 에러", e);
            throw new RuntimeException("파일 IO 에러");
        }
    }

    /**
     * 기본 파일 업로드 메서드 (하위 호환성 유지)
     */
    public String uploadFile(MultipartFile file) {
        return uploadFile(file, "");
    }

    /**
     * 바이트 배열 업로드 메서드
     */
    public String uploadBytes(byte[] bytes, String fileName, String contentType, String prefix) {
        String uuid = UUID.randomUUID().toString();
        String fileExtension = fileName.contains(".") ? fileName.substring(fileName.lastIndexOf(".")) : "";

        // prefix + UUID + 시간값 + 확장자
        String key = prefix + uuid + System.currentTimeMillis() + fileExtension;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(contentType)
                .build();

        PutObjectResponse response = s3Client.putObject(putObjectRequest,
                software.amazon.awssdk.core.sync.RequestBody.fromBytes(bytes));

        if (response.sdkHttpResponse().isSuccessful()) {
            log.info("바이트 배열 업로드 성공: {}", key);
            return filePrefix + key;
        } else {
            log.error("바이트 배열 업로드 실패: {}", key);
            throw new RuntimeException("파일 업로드 실패");
        }
    }

    /**
     * S3 파일 삭제
     */
    public void deleteFile(String fileUrl) {
        // S3에서의 파일 경로 추출
        String fileKey = fileUrl.replace(filePrefix, "");

        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build();

        try {
            s3Client.deleteObject(deleteObjectRequest);
            log.info("파일 삭제 성공: {}", fileKey);
        } catch (AwsServiceException e) {
            log.error("파일 삭제 실패: {}", fileKey, e);
            throw new RuntimeException("파일 삭제 실패");
        }
    }

    /**
     * 파일 업데이트 메서드
     */
    public String updateFile(String existingFileUrl, MultipartFile newFile, String prefix) throws IOException {
        // 기존 파일 삭제
        deleteFile(existingFileUrl);

        // 새 파일 업로드
        return uploadFile(newFile, prefix);
    }

    /**
     * 파일 업데이트 메서드 (하위 호환성 유지)
     */
    public String updateFile(String existingFileUrl, MultipartFile newFile) throws IOException {
        return updateFile(existingFileUrl, newFile, "");
    }

    /**
     * S3 파일을 바이트 배열로 가져오기
     */
    public byte[] getFileAsBytes(String fileUrl) {
        String fileKey = fileUrl.replace(filePrefix, "");

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build();

        try (ResponseInputStream<GetObjectResponse> s3Object = s3Client.getObject(getObjectRequest);
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            byte[] buffer = new byte[1024];
            int length;
            while ((length = s3Object.read(buffer)) != -1) {
                outputStream.write(buffer, 0, length);
            }

            log.info("S3 파일 다운로드 성공: {}", fileKey);
            return outputStream.toByteArray();
        } catch (IOException e) {
            log.error("S3 파일 다운로드 실패: {}", fileKey, e);
            throw new RuntimeException("파일 다운로드 실패", e);
        }
    }

    /**
     * S3 파일을 MultipartFile로 가져오기
     */
    public MultipartFile getFileAsMultipartFile(String fileUrl, String contentType) {
        byte[] fileBytes = getFileAsBytes(fileUrl);
        String fileKey = fileUrl.replace(filePrefix, "");
        String fileName = fileKey.substring(fileKey.lastIndexOf("/") + 1);

        return new CustomMultipartFile(fileBytes, fileName, contentType);
    }
}

