package com.checkmate.global.common.exception;

import com.checkmate.global.common.response.ApiResult;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {


    /**
     * 비즈니스 예외를 처리합니다.
     *
     * <p>
     * 이 메서드는 애플리케이션에서 발생한 {@link CustomException}을 처리하며,
     * 에러 코드에 따라 적절한 응답을 생성하여 반환합니다.
     * </p>
     *
     * @param e 처리할 비즈니스 예외
     * @return 에러 코드에 기반한 HTTP 응답 엔터티
     */
    @ExceptionHandler(CustomException.class)
    protected ApiResult<?> handleCustomException(CustomException e) {
        log.error("handleCustomException: {}", e.getMessage());
        return ApiResult.fail(e);
    }

    /**
     * 일반적인 예외를 처리합니다.
     *
     * <p>
     * 이 메서드는 {@link CustomException} 외에 발생하는 예외를 처리하며,
     * 내부 서버 에러 코드를 포함한 HTTP 응답을 생성하여 반환합니다.
     * 처리 과정에서 발생한 예외 정보는 로그로 기록됩니다.
     * </p>
     *
     * @param e 처리할 예외
     * @return 내부 서버 에러를 나타내는 HTTP 응답 엔터티
     */
    @ExceptionHandler(Exception.class)
    protected ApiResult<?> handleException(Exception e) {
        log.error("Unhandled exception occurred: ", e);
        return ApiResult.fail(new CustomException(ErrorCode.INTERNAL_SERVER_ERROR));
    }

    /**
     * 사용자 입력값 검증 예외를 처리합니다.
     *
     * <p>
     * 요청 바디에서 입력값 검증 실패 시 발생하는 {@link MethodArgumentNotValidException} {@link ConstraintViolationException}을 처리합니다.
     * 필드별 에러 메시지를 조합하여 응답에 포함합니다.
     * </p>
     *
     * @param e 입력값 검증 예외
     * @return 검증 실패에 대한 HTTP 응답 엔터티
     */
    @ExceptionHandler({ MethodArgumentNotValidException.class, ConstraintViolationException.class })
    public ApiResult<?> handleValidException(Exception e) {
        String errorMessages;
        if (e instanceof MethodArgumentNotValidException manvEx) {
            BindingResult bindingResult = manvEx.getBindingResult();
            errorMessages = bindingResult.getFieldErrors().stream()
                    .map(fieldError -> String.format("[%s]은(는) %s", fieldError.getField(), fieldError.getDefaultMessage()))
                    .reduce((m1, m2) -> m1 + ". " + m2)
                    .orElse("입력값 검증 오류가 발생했습니다.");
        } else { // ConstraintViolationException
            ConstraintViolationException cve = (ConstraintViolationException) e;
            errorMessages = cve.getConstraintViolations().stream()
                    .map(violation -> String.format("[%s]은(는) %s", violation.getPropertyPath(), violation.getMessage()))
                    .reduce((m1, m2) -> m1 + ". " + m2)
                    .orElse("입력값 검증 오류가 발생했습니다.");
        }
        log.error("handleValidException: {}", errorMessages);
        return ApiResult.fail(new CustomException(ErrorCode.INVALID_INPUT_VALUE), errorMessages);
    }

    /**
     * 필수 요청 파라미터가 누락되었을 때 발생하는 예외를 처리합니다.
     *
     * @param ex {@link MissingServletRequestParameterException}
     * @return 요청 파라미터 누락에 대한 {@link ApiResult} 응답
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ApiResult<?> handleMissingServletRequestParameter(MissingServletRequestParameterException ex) {
        String name = ex.getParameterName();
        String message = String.format("필수 요청 파라미터 '%s'가 누락되었습니다.", name);
        log.error("handleMissingServletRequestParameter: {}", message);
        return ApiResult.fail(new CustomException(ErrorCode.INVALID_INPUT_VALUE), message);
    }
}

