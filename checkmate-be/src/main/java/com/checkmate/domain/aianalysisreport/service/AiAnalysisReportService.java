package com.checkmate.domain.aianalysisreport.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import com.checkmate.domain.aianalysisreport.dto.response.AiAnalysisReportResponseDto;
import com.checkmate.domain.aianalysisreport.entity.CompleteAiAnalysisReport;
import com.checkmate.domain.aianalysisreport.repository.AiAnalysisReportRepository;
import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contract.repository.ContractRepository;
import com.checkmate.domain.contractcategory.entity.ContractCategory;
import com.checkmate.domain.ocrresult.entity.OcrResult;
import com.checkmate.domain.ocrresult.repository.OcrResultRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Scheduler;
import reactor.core.scheduler.Schedulers;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiAnalysisReportService {
	private final AiAnalysisReportRepository aiAnalysisReportRepository;
	private final ContractRepository contractRepository;
	private final ObjectMapper objectMapper;
	private final OcrResultRepository ocrResultRepository;
	private final WebClient webClient;
	private final Scheduler scheduler = Schedulers.boundedElastic();

	/**
	 * AI 분석 리포트 조회
	 *
	 * @param contractId 계약서 ID
	 * @return AI 분석 리포트 ID, 계약서 ID, 개선 사항, 위험 사항, 누락 사항, 생성 일자
	 */
	public AiAnalysisReportResponseDto getAiAnalysisReportByContractId(int contractId) {
		if (!contractRepository.existsById(contractId)) {
			throw new CustomException(ErrorCode.CONTRACT_NOT_FOUND);
		}
		CompleteAiAnalysisReport aiAnalysisReport = aiAnalysisReportRepository
			.getCompleteReportByContractId(contractId)
			.orElseThrow(() -> new CustomException(ErrorCode.AI_ANALYSIS_REPORT_NOT_FOUND));
		return AiAnalysisReportResponseDto.fromEntity(aiAnalysisReport);
	}

	/**
	 * 계약서를 분석하고 결과를 비동기적으로 반환합니다.
	 *
	 * @param contractId 계약서 ID
	 * @return 분석 결과를 포함한 JSON 응답
	 */
	@Transactional(readOnly = true)
	public Mono<JsonNode> analyzeContractAsync(int contractId) {
		// 블로킹 작업을 별도 스레드 풀에서 실행
		return Mono.fromCallable(() -> {
				// 1. 계약서 존재 여부 확인
				Contract contract = contractRepository.findById(contractId)
					.orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));

				// TODO: OCR 부분 기능 구현 끝나면 다시 수정 필요
				// TODO: OCR 저장 기능도 추가해야 할 가능성 있음
				// // 2. OCR 결과에서 텍스트 가져오기
				// List<OcrResult> ocrResults = ocrResultRepository.findByContractIdOrderByPageNo(contractId);
				// if (ocrResults.isEmpty()) {
				// 	throw new CustomException(ErrorCode.OCR_RESULT_NOT_FOUND, "OCR 결과가 없습니다.");
				// }

				// 3. 모든 페이지의 OCR 텍스트를 하나로 합칩니다.
				String contractText = ocrResults.stream()
					.map(OcrResult::getOcrText)
					.collect(Collectors.joining("\n\n"));

				// 4. 계약서 카테고리 ID 가져오기
				ContractCategory category = contract.getCategory();
				int categoryId = category.getId();

				// 필요한 데이터를 반환
				return new Object[]{contractText, categoryId};
			})
			.subscribeOn(scheduler) // 이 작업은 별도 스레드 풀에서 실행
			.flatMap(data -> {
				String contractText = (String) ((Object[])data)[0];
				int categoryId = (int) ((Object[])data)[1];

				// 5. FastAPI 요청 본문 생성
				ObjectNode requestBody = objectMapper.createObjectNode();
				requestBody.put("contract_text", contractText);
				requestBody.put("contract_id", contractId);
				requestBody.put("contract_category_id", categoryId);

				return webClient.post()
					.uri("/api/analyze")
					.contentType(MediaType.APPLICATION_JSON)
					.bodyValue(requestBody)
					.retrieve()
					.bodyToMono(JsonNode.class);
			})
			.onErrorResume(error -> {
				if (error instanceof CustomException) {
					throw (CustomException) error;
				}
				log.error("계약서 분석 중 오류 발생: {}", error.getMessage());
				throw new CustomException(ErrorCode.AI_ANALYSIS_API_ERROR);
			});
	}
}
