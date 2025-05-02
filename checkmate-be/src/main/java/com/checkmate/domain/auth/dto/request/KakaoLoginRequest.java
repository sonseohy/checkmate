package com.checkmate.domain.auth.dto.request;

import com.checkmate.domain.user.entity.Status;
import com.checkmate.domain.user.entity.User;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@Slf4j
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record KakaoLoginRequest(
        String name,
        @NotBlank @Email String email,
        @Pattern(regexp = "^$|\\d{4}") String birthyear,
        @Pattern(regexp = "^$|\\d{4}") String birthday,
        @NotBlank String phoneNumber,
        @NotBlank String providerId

) {
    public User toUserEntity() {
        User.UserBuilder builder = User.builder()
                .email(email)
                .providerId(providerId)
                .phone(phoneNumber)
                .status(Status.ACTIVE)
                .createdAt(LocalDateTime.now());

        if (Objects.nonNull(name) && !name.isBlank()) {
            builder.name(name);
        }

        if (Objects.nonNull(birthyear) && !birthyear.isBlank()
                && Objects.nonNull(birthday) && !birthday.isBlank()) {

            try {
                LocalDate birthDate = LocalDate.of(
                        Integer.parseInt(birthyear),
                        Integer.parseInt(birthday.substring(0, 2)),
                        Integer.parseInt(birthday.substring(2))
                );
                builder.birth(birthDate);
            } catch (NumberFormatException | IndexOutOfBoundsException e) {
                log.warn("[로그인] 부적절한 생일 필드 요청");
            }
        }

        return builder.build();
    }
}
