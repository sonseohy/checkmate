package com.checkmate.global.common.dto;

import com.checkmate.global.common.exception.ErrorCode;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.util.Objects;

@Getter
public class ExceptionDto {
    @NotNull
    private final String code;

    @NotNull
    private final String message;

    /**
     * 기본 에러 코드 기반 생성자
     *
     * @param errorCode 시스템에 정의된 에러 코드
     */
    public ExceptionDto(ErrorCode errorCode) {
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
    }

    /**
     * 에러 코드와 커스텀 메시지 기반 생성자
     *
     * @param errorCode 시스템에 정의된 에러 코드
     * @param customMessage 추가 오류 상세 내용
     */
    public ExceptionDto(ErrorCode errorCode, String customMessage) {
        this.code = errorCode.getCode();
        StringBuilder sb = new StringBuilder();
        sb.append(errorCode.getMessage());
        if (Objects.nonNull(customMessage) && !customMessage.isEmpty()) {
            sb.append(" ").append(customMessage);
        }
        this.message = sb.toString();
    }

    /**
     * 정적 팩토리 메서드: 기본 메시지 기반 예외 DTO 생성
     *
     * @param errorCode {@link ErrorCode}
     * @return {@link ExceptionDto} 인스턴스
     */
    public static ExceptionDto of(ErrorCode errorCode) {
        return new ExceptionDto(errorCode);
    }

    /**
     * 정적 팩토리 메서드: 기본 + 커스텀 메시지 기반 예외 DTO 생성
     *
     * @param errorCode {@link ErrorCode}
     * @param customMessage 추가 메시지
     * @return {@link ExceptionDto} 인스턴스
     */
    public static ExceptionDto of(ErrorCode errorCode, String customMessage) {
        return new ExceptionDto(errorCode, customMessage);
    }

}

