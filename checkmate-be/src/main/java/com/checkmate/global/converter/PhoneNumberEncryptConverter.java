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

    @Override
    public String convertToDatabaseColumn(String phoneNumber) {
        if (Objects.isNull(phoneNumber))
            return null;

        return encryptionUtil.encrypt(phoneNumber);
    }

    @Override
    public String convertToEntityAttribute(String encryptedPhoneNumber) {
        if (Objects.isNull(encryptedPhoneNumber))
            return null;

        return encryptionUtil.decrypt(encryptedPhoneNumber);
    }
}
