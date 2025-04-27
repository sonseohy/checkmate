package com.checkmate.domain.user.controller;

import com.checkmate.domain.user.dto.request.UserUpdateRequest;
import com.checkmate.domain.user.dto.response.UserGetResponse;
import com.checkmate.domain.user.dto.response.UserUpdateResponse;
import com.checkmate.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.checkmate.domain.user.dto.CustomUserDetails;
import com.checkmate.global.common.response.ApiResult;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User API", description = "회원 정보 관련 API")
public class UserController {
    private final UserService userService;

    @Operation(summary = "회원 정보 조회", description = "회원 정보를 조회합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "회원 정보 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패", content = @Content),
            @ApiResponse(responseCode = "404", description = "사용자 없음", content = @Content)
    })
    @GetMapping
    public ApiResult<UserGetResponse> getUser(@Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        UserGetResponse userGetResponse = userService.getUser(userDetails.getUserId());
        return ApiResult.ok(userGetResponse);
    }

    @Operation(summary = "회원 정보 수정", description = "회원 정보를 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "회원 정보 수정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "401", description = "인증 실패", content = @Content),
            @ApiResponse(responseCode = "404", description = "사용자 없음", content = @Content)
    })
    @PutMapping
    public ApiResult<UserUpdateResponse> updateUser(@Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails userDetails,
                                                    @Valid @RequestBody UserUpdateRequest userUpdateRequest) {
        UserUpdateResponse userUpdateResponse = userService.updateUser(userDetails.getUserId(), userUpdateRequest);
        return ApiResult.ok(userUpdateResponse);
    }

    @Operation(summary = "회원 탈퇴", description = "회원 탈퇴를 처리합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "회원 탈퇴 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패", content = @Content),
            @ApiResponse(responseCode = "404", description = "사용자 없음", content = @Content)
    })
    @DeleteMapping
    public ApiResult<?> deleteUser(@Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        userService.deleteUser(userDetails.getUserId());
        return ApiResult.noContent();
    }

}
