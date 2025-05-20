package com.checkmate.global.converter;

import com.checkmate.global.util.EncryptionUtil;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Convert;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Convert
@Component
@RequiredArgsConstructor
public class PhoneNumberEncryptConverter implements AttributeConverter<String, String> {
    private final EncryptionUtil encryptionUtil;

    /**
     * 엔티티의 전화번호를 데이터베이스 컬럼으로 변환
     * 전화번호를 암호화하여 저장
     *
     * @param phoneNumber 암호화할 전화번호
     * @return 암호화된 전화번호
     */
    @Override
    public String convertToDatabaseColumn(String phoneNumber) {
        if (Objects.isNull(phoneNumber))
            return null;

        return encryptionUtil.encrypt(phoneNumber);
    }

    /**
     * 데이터베이스 컬럼을 엔티티의 전화번호로 변환
     * 암호화된 전화번호를 복호화
     *
     * @param encryptedPhoneNumber 복호화할 암호화된 전화번호
     * @return 복호화된 전화번호
     */
    @Override
    public String convertToEntityAttribute(String encryptedPhoneNumber) {
        if (Objects.isNull(encryptedPhoneNumber))
            return null;

        return encryptionUtil.decrypt(encryptedPhoneNumber);
    }
}
