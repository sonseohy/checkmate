package com.checkmate.global.common.advice;

import com.checkmate.global.common.response.ApiResult;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@RestControllerAdvice
public class GlobalResponseAdvice implements ResponseBodyAdvice<Object> {

    /**
     * 응답 변환을 적용할지 여부를 결정합니다.
     * 항상 true를 반환하여 모든 컨트롤러 응답에 적용합니다.
     *
     * @param returnType 메서드 반환 타입
     * @param converterType 메시지 컨버터 타입
     * @return 항상 true
     */
    @Override
    public boolean supports(MethodParameter returnType,
                            Class<? extends HttpMessageConverter<?>> converterType) {
        if (RequestContextHolder.getRequestAttributes() == null) {
            return MappingJackson2HttpMessageConverter.class.isAssignableFrom(converterType);
        }

        // 요청 URI 가져오기
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
                .getRequest();
        String uri = request.getRequestURI();

        // Swagger UI 관련 경로는 제외
        if (uri.startsWith("/swagger-ui") ||
                uri.startsWith("/docs") ||
                uri.startsWith("/v3/api-docs") ||
                uri.equals("/swagger") ||
                uri.equals("/docs.html") ||
                uri.startsWith("/webjars")) {
            return false;
        }

        return MappingJackson2HttpMessageConverter.class.isAssignableFrom(converterType);
    }

    /**
     * 실제 응답 본문을 작성하기 전에 가공 작업을 수행합니다.
     * {@link ApiResult} 타입인 경우, 내부 status 값을 HTTP 응답 코드로 설정합니다.
     *
     * @param body 컨트롤러에서 반환된 응답 본문
     * @param returnType 반환 타입 정보
     * @param selectedContentType 선택된 Content-Type
     * @param selectedConverterType 선택된 메시지 컨버터
     * @param request 서버 요청
     * @param response 서버 응답
     * @return 가공된 응답 본문
     */
    @Override
    public Object beforeBodyWrite(Object body,
                                  MethodParameter returnType,
                                  MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request,
                                  ServerHttpResponse response) {

        if (!MediaType.APPLICATION_JSON.isCompatibleWith(selectedContentType)) {
            return body;
        }

        if (body instanceof ApiResult<?> api) {
            response.setStatusCode(api.status());
            return api;
        }

        ApiResult<Object> wrap = ApiResult.ok(body);
        response.setStatusCode(wrap.status());
        return wrap;
    }
}
