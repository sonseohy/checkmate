package com.checkmate.domain.contract.dto.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@Getter
@Setter
@Schema(description = "계약서 업로드 요청 (multipart/form-data)")
public class ContractUploadsRequest {

    @Schema(description = "계약 제목", example="임대차 계약서")
    @NotBlank @Size(max=30)
    private String title;

    @Schema(description = "카테고리 ID", example="1")
    @NotNull
    private Integer categoryId;

    @ArraySchema(
            schema      = @Schema(type="string", format="binary"),
            arraySchema = @Schema(description="업로드할 계약서 파일 목록")
    )
    private List<MultipartFile> files;
}
