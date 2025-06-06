package com.checkmate.global.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Component;

@Component
public class EncryptionUtil {

    private final TextEncryptor textEncryptor;

    /**
     * EncryptionUtil 생성자
     * 암호와 솔트를 사용하여 TextEncryptor 초기화
     *
     * @param password 암호화에 사용할 비밀번호
     * @param salt 암호화에 사용할 솔트 값
     */
    public EncryptionUtil(
            @Value("${encryption.password}") String password,
            @Value("${encryption.salt}") String salt
    ) {
        this.textEncryptor = Encryptors.text(password, salt);
    }

    /**
     * 평문 문자열을 암호화합니다.
     *
     * <p>Spring Security의 {@code Encryptors.text()}를 통해 생성된 {@link TextEncryptor}를 사용하여
     * 전달된 문자열을 암호화합니다.</p>
     *
     * @param plainText 암호화할 평문 문자열
     * @return 암호화된 문자열
     */
    public String encrypt(String plainText) {
        return textEncryptor.encrypt(plainText);
    }

    /**
     * 암호화된 문자열을 복호화합니다.
     *
     * <p>{@link #encrypt(String)} 메서드로 암호화된 문자열을 다시 평문으로 복호화합니다.</p>
     *
     * @param encryptedText 복호화할 암호문 문자열
     * @return 복호화된 평문 문자열
     */
    public String decrypt(String encryptedText) {
        return textEncryptor.decrypt(encryptedText);
    }
}