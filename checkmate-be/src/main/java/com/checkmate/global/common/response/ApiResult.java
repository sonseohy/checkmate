package com.checkmate.global.common.response;

import com.checkmate.global.common.dto.ExceptionDto;
import com.checkmate.global.common.exception.CustomException;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.annotation.Nullable;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public record ApiResult<T>(
        @JsonIgnore
        HttpStatus status,
        boolean success,
        @Nullable T data,
        @Nullable ExceptionDto error,
        LocalDateTime timestamp
) {

    /**
     * 정상 처리된 요청에 대해 200 OK 응답을 생성합니다.
     *
     * <p>요청 처리 결과 데이터를 포함하여 성공 응답을 생성합니다.</p>
     *
     * @param data 응답으로 반환할 데이터
     * @return HTTP 200 상태의 {@link ApiResult} 객체
     */
    public static <T> ApiResult<T> ok(T data) {
        return new ApiResult<>(HttpStatus.OK, true, data, null, LocalDateTime.now());
    }

    /**
     * 자원이 성공적으로 생성되었을 때 201 Created 응답을 생성합니다.
     *
     * <p>생성된 자원 데이터를 포함할 수 있습니다.</p>
     *
     * @param data 생성된 자원에 대한 응답 데이터 (nullable)
     * @return HTTP 201 상태의 {@link ApiResult} 객체
     */
    public static <T> ApiResult<T> created(@Nullable final T data) {
        return new ApiResult<>(HttpStatus.CREATED, true, data, null, LocalDateTime.now());
    }

    /**
     * 응답 본문 없이 성공적으로 처리되었음을 나타내는 204 No Content 응답을 생성합니다.
     *
     * <p>삭제 또는 업데이트 이후 반환할 데이터가 없을 때 사용됩니다.</p>
     *
     * @return HTTP 204 상태의 {@link ApiResult} 객체
     */
    public static <T> ApiResult<T> noContent() {
        return new ApiResult<>(HttpStatus.NO_CONTENT, true, null, null, LocalDateTime.now());
    }

    /**
     * 비즈니스 예외 발생 시 실패 응답을 생성합니다.
     *
     * <p>{@link CustomException}으로부터 에러 정보를 추출하여 포함시킵니다.</p>
     *
     * @param e 처리 중 발생한 커스텀 예외
     * @return 에러 정보가 포함된 실패 {@link ApiResult} 객체
     */
    public static <T> ApiResult<T> fail(CustomException e) {
        return new ApiResult<>(e.getErrorCode().getHttpStatus(), false, null, ExceptionDto.of(e.getErrorCode()), LocalDateTime.now());
    }

    /**
     * 커스텀 예외와 메시지를 포함한 실패 응답을 생성합니다.
     *
     * <p>{@link CustomException}의 에러 코드와 함께 사용자 정의 메시지를 포함한 에러 정보를 제공합니다.</p>
     *
     * @param e       처리 중 발생한 커스텀 예외
     * @param message 사용자 정의 에러 메시지
     * @return 에러 정보가 포함된 실패 {@link ApiResult} 객체
     */
    public static <T> ApiResult<T> fail(CustomException e, String message) {
        return new ApiResult<>(e.getErrorCode().getHttpStatus(), false, null, ExceptionDto.of(e.getErrorCode(), message), LocalDateTime.now());
    }
}

