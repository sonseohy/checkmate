package com.checkmate.global.common.filter;

import com.checkmate.domain.user.service.UserService;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import com.checkmate.global.common.response.ApiResult;
import com.checkmate.global.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    private static final String[] AllowUrls = new String[]{
            "/api/auth/",
            "/docs.html",
            "/docs",
            "/swagger-ui",
            "/swagger-ui.html",
            "/swagger-resources",
            "/v3/api-docs",
            "/webjars",
            "/api/categories",
            "/api/news",
            "/api/chatbot",
            "/api/courthouses",
            "/api/hellosign/callback",
            "/ws/",
            "/api/analysis/webhook",
            "/api/check-list",
            "/app"
    };

    /**
     * 요청마다 실행되며, JWT 토큰 검증 및 인증 처리 로직을 수행합니다.
     *
     * @param request       HTTP 요청
     * @param response      HTTP 응답
     * @param filterChain   필터 체인
     * @throws ServletException 필터 처리 중 예외
     * @throws IOException      입출력 예외
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String uri = request.getRequestURI();
        String method = request.getMethod();
        // JWT 검증 제외
        if (Arrays.stream(AllowUrls).anyMatch(uri::startsWith) && !request.getRequestURI().equals("/api/auth/logout")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        if (Objects.isNull(authHeader) || !authHeader.startsWith("Bearer ")) {
            writeErrorResponse(response, ErrorCode.UNAUTHORIZED);
            return;
        }

        String token = authHeader.substring(7);
        if (jwtUtil.validateToken(token)) {
            processValidAccessToken(token);
        } else {
            writeErrorResponse(response, ErrorCode.INVALID_TOKEN);
            return;
        }

        filterChain.doFilter(request, response);
    }

    /**
     * 특정 조건(GET 요청의 일부 API 경로)에 대해 토큰이 있다면 처리, 없으면 통과합니다.
     *
     * @param request  HTTP 요청
     * @param response HTTP 응답
     * @return 유효하지 않은 토큰이면 false, 그 외 true
     * @throws IOException 응답 쓰기 중 발생하는 예외
     */
    private boolean tryProcessToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                processValidAccessToken(token);
            } else {
                writeErrorResponse(response, ErrorCode.INVALID_TOKEN);
                return false;
            }
        }
        return true;
    }

    /**
     * 유효한 액세스 토큰으로부터 사용자 정보를 추출하고 SecurityContext에 설정합니다.
     *
     * @param accessToken 검증된 액세스 토큰
     */
    private void processValidAccessToken(String accessToken) {
        UserDetails userDetails = userService.loadUserByUsername(jwtUtil.getUserIdFromToken(accessToken));
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    /**
     * JWT 검증 실패 또는 인증 정보가 없을 경우 JSON 형태의 에러 응답을 반환합니다.
     *
     * @param response  HTTP 응답
     * @param errorCode 반환할 에러 코드
     * @throws IOException 응답 쓰기 중 발생하는 예외
     */
    private void writeErrorResponse(HttpServletResponse response, ErrorCode errorCode) throws IOException {
        response.setStatus(errorCode.getHttpStatus().value());
        response.setContentType("application/json;charset=utf-8");

        ApiResult<?> apiResult = ApiResult.fail(new CustomException(ErrorCode.UNAUTHORIZED));
        String jsonResponse = objectMapper.writeValueAsString(apiResult);
        response.getWriter().write(jsonResponse);
    }


}
