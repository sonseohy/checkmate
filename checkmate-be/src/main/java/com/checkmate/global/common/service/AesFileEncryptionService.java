package com.checkmate.global.common.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.security.GeneralSecurityException;
import java.util.Base64;

@Service
public class AesFileEncryptionService {

    private static final String ALGORITHM       = "AES";
    private static final String TRANSFORMATION  = "AES/GCM/NoPadding";
    private static final int    IV_LENGTH_BYTES = 12;    // 96 bits
    private static final int    TAG_LENGTH_BITS = 128;   // 128 bits

    private final byte[]         keyBytes;
    private final SecureRandom secureRandom = new SecureRandom();
    private SecretKeySpec secretKey;

    public AesFileEncryptionService(
            @Value("${aes.encryption.base64-key}") String base64Key
    ) {
        this.keyBytes = Base64.getDecoder().decode(base64Key);
    }

    @PostConstruct
    private void init() {
        if (keyBytes.length != 32) {
            throw new IllegalArgumentException("AES key must be 256 bits (32 bytes)");
        }
        this.secretKey = new SecretKeySpec(keyBytes, ALGORITHM);
    }

    /**
     * AES-GCM 으로 평문 바이트를 암호화하고,
     * 암호문과 IV를 함께 반환합니다.
     */
    public EncryptedPayload encrypt(byte[] plaintext) {
        try {
            byte[] iv = new byte[IV_LENGTH_BYTES];
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec spec = new GCMParameterSpec(TAG_LENGTH_BITS, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, spec);

            byte[] ciphertext = cipher.doFinal(plaintext);
            return new EncryptedPayload(ciphertext, iv);

        } catch (GeneralSecurityException e) {
            throw new RuntimeException("AES 암호화 실패", e);
        }
    }

    /**
     * AES-GCM 으로 암호문(ciphertext)과 IV를 주면
     * 평문을 복호화하여 반환합니다.
     */
    public byte[] decrypt(byte[] ciphertext, byte[] iv) {
        try {
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec spec = new GCMParameterSpec(TAG_LENGTH_BITS, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, spec);

            return cipher.doFinal(ciphertext);

        } catch (GeneralSecurityException e) {
            throw new RuntimeException("AES 복호화 실패", e);
        }
    }

    /** 암호문 + IV 를 함께 담는 DTO */
    public static class EncryptedPayload {
        private final byte[] ciphertext;
        private final byte[] iv;

        public EncryptedPayload(byte[] ciphertext, byte[] iv) {
            this.ciphertext = ciphertext;
            this.iv         = iv;
        }

        public byte[] getCiphertext() { return ciphertext; }
        public byte[] getIv()         { return iv;         }
    }
}