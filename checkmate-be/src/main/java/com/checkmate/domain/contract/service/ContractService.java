package com.checkmate.domain.contract.service;

import com.checkmate.domain.contract.dto.request.ContractUploadsRequest;
import com.checkmate.domain.contract.dto.response.ContractDetailsResponseDto;
import com.checkmate.domain.contract.dto.response.ContractUploadResponse;
import com.checkmate.domain.contract.dto.response.FileNumberResponse;
import com.checkmate.domain.contract.dto.response.MyContractResponse;
import com.checkmate.domain.contract.entity.*;
import com.checkmate.domain.contract.repository.ContractRepository;
import com.checkmate.domain.contractcategory.entity.ContractCategory;
import com.checkmate.domain.contractcategory.service.ContractCategoryService;
import com.checkmate.domain.template.dto.response.TemplateResponseDto;
import com.checkmate.domain.template.service.TemplateService;
import com.checkmate.domain.user.entity.User;
import com.checkmate.domain.user.service.UserService;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContractService {

    private final UserService userService;
    private final ContractCategoryService categoryService;
    private final ContractFileService contractFileService;
    private final ContractRepository contractRepository;
    private final TemplateService templateService;

    @Transactional
    public ContractUploadResponse uploadContract(Integer userId, ContractUploadsRequest request) {

        User user = userService.findUserById(userId);
        ContractCategory category = categoryService.findContractCategoryById(request.getCategoryId());

        Contract contract = Contract.builder()
                .user(user)
                .category(category)
                .title(request.getTitle())
                .editStatus(EditStatus.COMPLETED)
                .sourceType(SourceType.USER_UPLOAD)
                .build();
        contract = contractRepository.save(contract);

        FileNumberResponse response = contractFileService.uploadContractFiles(contract, request.getFiles());
        contract.setPageNo(response.getPageNo());


        return ContractUploadResponse.builder()
                .contractId(contract.getId())
                .title(contract.getTitle())
                .createdAt(contract.getCreatedAt())
                .build();

    }

    @Transactional(readOnly = true)
    public List<MyContractResponse> getMyContracts(Integer userId) {

        User user = userService.findUserById(userId);

        List<Contract> contracts = contractRepository.findAllByUser(user);

        return contracts.stream()
                .map(contract -> MyContractResponse.builder()
                        .contractId(contract.getId())
                        .categoryId(contract.getCategory().getId())
                        .title(contract.getTitle())
                        .sourceType(contract.getSourceType())
                        .editStatus(contract.getEditStatus())
                        .updatedAt(contract.getUpdatedAt())
                        .build()
                )
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteMyContract(int userId, Integer contractId) {

        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));

        if (!contract.getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.CONTRACT_ACCESS_DENIED);
        }

        contract.getFiles().forEach(file -> {
            contractFileService.deleteFileByAddress(file.getFileAddress());
        });

        contractRepository.deleteById(contractId);
    }

    @Transactional(readOnly = true)
    public ContractDetailsResponseDto getContractWithTemplateAndValues(Integer userId, Integer contractId) {

        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));

        if (!contract.getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.CONTRACT_ACCESS_DENIED);
        }

        // 템플릿 응답 정보 조회 (기존 서비스 활용)
        TemplateResponseDto templateResponse = templateService.getTemplate(contract.getTemplate().getId());

        Map<String, Object> valueMap = new HashMap<>();
        contract.getFieldValues().forEach(fieldValue ->
                valueMap.put(fieldValue.getField().getFieldKey(), fieldValue.getValue())
        );

        // 통합 응답 생성
        return ContractDetailsResponseDto.builder()
                .contract(TemplateResponseDto.ContractDto.builder()
                        .id(contract.getId())
                        .build())
                .template(templateResponse.getTemplate())
                .sections(templateResponse.getSections())
                .values(valueMap)
                .build();
    }

}
