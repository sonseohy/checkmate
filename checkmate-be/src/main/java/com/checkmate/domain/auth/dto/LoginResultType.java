package com.checkmate.domain.auth.dto;

import lombok.Getter;

@Getter
public enum LoginResultType {
    NEW_ACCOUNT("신규 계정 생성됨"),
    ALREADY_ACTIVE("이미 활성화된 계정"),
    RECOVERED("복구된 계정"),
    EXPIRED("복구 기간 만료");

    private final String description;

    LoginResultType(String description) {
        this.description = description;
    }
}
