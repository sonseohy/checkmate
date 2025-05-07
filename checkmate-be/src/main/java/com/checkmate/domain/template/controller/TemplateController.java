package com.checkmate.domain.template.controller;

import com.checkmate.domain.template.dto.response.TemplateResponseDto;
import com.checkmate.domain.template.service.TemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
public class TemplateController {
    private final TemplateService templateService;

    @GetMapping("/{templateId}")
    public ResponseEntity<TemplateResponseDto> getTemplate(@PathVariable Integer templateId) {
        TemplateResponseDto response = templateService.getTemplate(templateId);
        return ResponseEntity.ok(response);
    }
}
