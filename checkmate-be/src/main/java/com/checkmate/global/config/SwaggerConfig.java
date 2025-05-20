package com.checkmate.global.config;


import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    /**
     * OpenAPI 문서 설정
     * API 문서 제목, 버전, JWT 인증 등 설정
     *
     * @return 설정된 OpenAPI 인스턴스
     */
    @Bean
    public OpenAPI openAPI() {

        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .in(SecurityScheme.In.HEADER)
                .name("Authorization");

        SecurityRequirement securityRequirement = new SecurityRequirement().addList("bearerAuth");

        return new OpenAPI()
                .addServersItem(new Server().url("/"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", securityScheme))
                .addSecurityItem(securityRequirement)
                .info(new Info()
                        .title("CheckMate API Document")
                        .version("v0.0.1")
                        .description("CheckMate API 명세서입니다."));
    }
}