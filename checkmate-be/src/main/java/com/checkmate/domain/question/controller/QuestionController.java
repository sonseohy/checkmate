package com.checkmate.domain.question.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.question.service.QuestionService;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuestionController {
	private final QuestionService questionService;
}
