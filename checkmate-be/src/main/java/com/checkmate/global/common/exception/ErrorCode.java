package com.checkmate.global.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum ErrorCode {
    INVALID_INPUT_VALUE( "COMMON-001", HttpStatus.BAD_REQUEST, "유효성 검증에 실패했습니다."),
    INTERNAL_SERVER_ERROR("COMMON-002", HttpStatus.INTERNAL_SERVER_ERROR, "서버에서 처리할 수 없습니다."),

    USER_REGISTRATION_FAILED( "AUTH-001", HttpStatus.INTERNAL_SERVER_ERROR, "회원 가입 처리 중 오류가 발생했습니다."),
    UNAUTHORIZED("AUTH-002", HttpStatus.UNAUTHORIZED, "인증이 필요합니다."),
    INVALID_TOKEN("AUTH-003", HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    TOKEN_STORAGE_FAILED("AUTH-004", HttpStatus.INTERNAL_SERVER_ERROR, "토큰 저장 중 오류가 발생했습니다."),
    INVALID_REFRESH_TOKEN("AUTH-005", HttpStatus.UNAUTHORIZED, "Redis 리프레시 토큰과 다릅니다."),

    CATEGORY_NOT_FOUND("CATEGORY-001", HttpStatus.NOT_FOUND, "존재하지 않는 카테고리입니다."),

    FILE_NOT_FOUND("FILE-001", HttpStatus.NOT_FOUND, "파일이 존재하지 않습니다."),
    FILE_VIRUS_DETECTED("FILE-002", HttpStatus.UNPROCESSABLE_ENTITY, "악성 파일이 감지되었습니다."),
    UNSUPPORTED_FILE_TYPE("FILE-003", HttpStatus.UNSUPPORTED_MEDIA_TYPE, "파일 확장자를 확인할 수 없습니다."),
    FILE_TOO_LARGE("FILE-004", HttpStatus.PAYLOAD_TOO_LARGE, "파일 최대 크기를 초과했습니다."),
    FILE_UPLOAD_FAILED("FILE-005", HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드 실패로 롤백 처리되었습니다."),
    FILE_CONVERSION_QUEUE_TIMEOUT("FILE-006", HttpStatus.TOO_MANY_REQUESTS, "HWP→PDF 변환 대기열이 가득 찼습니다."),
    FILE_CONVERSION_TIMEOUT("FILE-007", HttpStatus.REQUEST_TIMEOUT, "HWP→PDF 변환이 타임아웃되었습니다."),
    FILE_CONVERSION_PROCESS_ERROR("FILE-008", HttpStatus.INTERNAL_SERVER_ERROR, "LibreOffice 변환 프로세스 중 오류가 발생했습니다."),
    FILE_CONVERSION_NO_OUTPUT("FILE-009", HttpStatus.INTERNAL_SERVER_ERROR, "변환된 PDF 파일을 찾을 수 없습니다."),
    FILE_CONVERSION_FAILED("FILE-010", HttpStatus.INTERNAL_SERVER_ERROR, "HWP→PDF 변환에 실패했습니다."),

    ENCRYPT_FAILED("ENCRYPT-001", HttpStatus.INTERNAL_SERVER_ERROR, "암호화에 실패했습니다."),
    DECRYPT_FAILED("ENCRYPT-002", HttpStatus.INTERNAL_SERVER_ERROR, "복호화에 실패했습니다."),

    USER_NOT_FOUND("USER-001", HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."),
    USER_DELETED("USER-002", HttpStatus.BAD_REQUEST, "탈퇴한 회원입니다."),

    CONTRACT_TITLE_REQUIRED("CONTRACT-001", HttpStatus.UNPROCESSABLE_ENTITY, "계약서명을 입력하지 않았습니다."),
    CONTRACT_NOT_FOUND("CONTRACT-002", HttpStatus.NOT_FOUND, "존재하지 않는 계약서입니다."),
    CONTRACT_ACCESS_DENIED("CONTRACT-003", HttpStatus.UNAUTHORIZED, "해당 계약서에 대한 접근 권한이 없습니다."),
    CONTRACT_NOT_FOUND_FOR_SIGNATURE("CONTRACT-004", HttpStatus.NOT_FOUND, "서명 요청 ID에 해당하는 계약을 찾을 수 없습니다."),
    CONTRACT_ALREADY_SIGNED("CONTRACT-005", HttpStatus.CONFLICT, "해당 계약서는 이미 전자서명되었습니다."),

    COURTHOUSE_NOT_FOUND("COURT-001", HttpStatus.NOT_FOUND, "법원 정보를 찾을 수 없습니다."),

    AI_ANALYSIS_REPORT_NOT_FOUND("ANALYSIS-001", HttpStatus.NOT_FOUND, "AI 분석 리포트를 찾을 수 없습니다."),

    TEMPLATE_NOT_FOUND("TEMPLATE-001", HttpStatus.NOT_FOUND, "존재하지 않는 템플릿입니다."),
    TEMPLATE_NOT_FOUND_FOR_CATEGORY("TEMPLATE-002", HttpStatus.NOT_FOUND, "해당 카테고리에 대한 템플릿을 찾을 수 없습니다."),

    SECTION_NOT_FOUND("SECTION-001", HttpStatus.NOT_FOUND, "존재하지 않는 섹션 ID입니다."),

    FIELD_NOT_FOUND("FIELD-001", HttpStatus.NOT_FOUND, "존재하지 않는 필드 ID입니다."),
    INVALID_FIELD_VALUE("FIELD-002", HttpStatus.BAD_REQUEST, "유효하지 않은 필드 값입니다."),
    MISSING_REQUIRED_FIELD("FIELD-003", HttpStatus.BAD_REQUEST, "필수 필드가 누락되었습니다."),
    DEPENDENCY_NOT_SATISFIED("FIELD-004", HttpStatus.BAD_REQUEST, "의존성 조건을 만족하지 않는 필드입니다."),
    MAPPING_NOT_FOUND("FIELD-005", HttpStatus.NOT_FOUND, "필드-카테고리 매핑을 찾을 수 없습니다."),

    INVALID_ID_FORMAT("MONGO-001", HttpStatus.BAD_REQUEST, "잘못된 ID 포멧입니다."),

    SUMMARY_REPORT_NOT_FOUND("SUMMARY-001", HttpStatus.NOT_FOUND, "존재하지 않는 요약입니다."),

    AI_ANALYSIS_API_ERROR("ANALYSIS-002", HttpStatus.INTERNAL_SERVER_ERROR, "AI 분석 서비스에 연결할 수 없습니다."),

    CLAUSE_NOT_FOUND("CLAUSE-001", HttpStatus.NOT_FOUND, "계약서 조항을 찾을 수 없습니다."),

    IMPROVEMENT_REPORT_NOT_FOUND("IMPROVEMENT-001", HttpStatus.NOT_FOUND, "개선 사항 리스트를 찾을 수 없습니다."),
    MISSING_REPORT_NOT_FOUND("MISSING-001", HttpStatus.NOT_FOUND, "누락 사항 리스트를 찾을 수 없습니다.."),
    RISK_NOT_FOUND("RISK-001", HttpStatus.NOT_FOUND, "위험 사항 리스트를 찾을 수 없습니다."),

    WEBHOOK_AUTH_FAILURE("WEBHOOK-001", HttpStatus.UNAUTHORIZED, "웹훅 인증에 실패했습니다."),

    NOTIFICATION_NOT_FOUND("NOTIFICATION-001", HttpStatus.NOT_FOUND, "알림을 찾을 수 없습니다."),
    NOTIFICATION_ACCESS_DENIED("NOTIFICATION-002", HttpStatus.UNAUTHORIZED, "해당 알림에 대한 접근 권한이 없습니다."),

    QUESTION_LIST_ACCESS_DENIED("QUESTION-001", HttpStatus.UNAUTHORIZED, "해당 질문 리스트에 대한 접근 권한이 없습니다."),
    MISSING_REPORT_ACCESS_DENIED("MISSING-002", HttpStatus.UNAUTHORIZED, "해당 누락 조항 리스트에 대한 접근 권한이 없습니다."),
    IMPROVEMENT_REPORT_ACCESS_DENIED("IMPROVEMENT-002", HttpStatus.UNAUTHORIZED, "해당 개선 사항 리스트에 대한 접근 권한이 없습니다."),
    RISK_ACCESS_DENIED("RISK-002", HttpStatus.UNAUTHORIZED, "해당 위험 사항 리스트에 대한 접근 권한이 없습니다."),
    AI_ANALYSIS_ACCESS_DENIED("ANALYSIS-003", HttpStatus.UNAUTHORIZED, "해당 AI 분석에 대한 접근 권한이 없습니다.");


    private final String code;
    private final HttpStatus httpStatus;
    private final String message;
}
