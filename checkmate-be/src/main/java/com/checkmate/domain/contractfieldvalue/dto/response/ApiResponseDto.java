package com.checkmate.domain.contractfieldvalue.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ApiResponseDto<T> {
    private boolean success;
    private T data;
    private ErrorDto error;
    private LocalDateTime timestamp = LocalDateTime.now();

    public static <T> ApiResponseDto<T> success(T data) {
        ApiResponseDto<T> response = new ApiResponseDto<>();
        response.setSuccess(true);
        response.setData(data);
        return response;
    }

    public static <T> ApiResponseDto<T> error(String code, String message) {
        ApiResponseDto<T> response = new ApiResponseDto<>();
        response.setSuccess(false);

        ErrorDto errorDto = new ErrorDto();
        errorDto.setCode(code);
        errorDto.setMessage(message);

        response.setError(errorDto);
        return response;
    }

    @Getter
    @Setter
    public static class ErrorDto {
        private String code;
        private String message;
    }
}