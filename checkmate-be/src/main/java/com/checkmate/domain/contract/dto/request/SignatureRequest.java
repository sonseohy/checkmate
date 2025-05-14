package com.checkmate.domain.contract.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignatureRequest {
    private String name;
    private String email;
}