package com.checkmate.domain.summaryreport.service;

import com.checkmate.domain.aianalysisreport.entity.AiAnalysisReport;
import com.checkmate.domain.aianalysisreport.repository.AiAnalysisReportRepository;
import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contract.repository.ContractRepository;
import com.checkmate.domain.summaryreport.entity.SummaryReport;
import com.checkmate.domain.summaryreport.repository.SummaryReportRepository;
import com.checkmate.domain.user.entity.User;
import com.checkmate.domain.user.service.UserService;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SummaryReportService {

     private final UserService userService;
     private final ContractRepository contractRepository;
     private final AiAnalysisReportRepository aiAnalysisReportRepository;
     private final SummaryReportRepository summaryReportRepository;

    /**
     * 계약서 요약 조회
     * 특정 계약서의 최신 AI 분석 요약 정보를 조회
     *
     * @param userId 사용자 ID
     * @param contractId 계약서 ID
     * @return 계약서 요약 정보
     */
    public SummaryReport getMyContractSummary(int userId, Integer contractId) {
        User user = userService.findUserById(userId);
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));

        if (!contract.getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.CONTRACT_ACCESS_DENIED);
        }

        AiAnalysisReport report = aiAnalysisReportRepository
                .findFirstByContractIdOrderByCreatedAtDesc(contractId)
                .orElseThrow(() -> new CustomException(ErrorCode.AI_ANALYSIS_REPORT_NOT_FOUND));
        log.debug("report"+report.getId());

        SummaryReport summaryReport = summaryReportRepository
                .findFirstByAiAnalysisReportIdOrderByCreatedAtDesc(report.getId())
                .orElseThrow(() -> new CustomException(ErrorCode.SUMMARY_REPORT_NOT_FOUND));
        log.debug("summary:"+summaryReport.getId());

        return summaryReport;
    }
}
