package com.checkmate.domain.contract.service;

import com.checkmate.domain.contract.dto.request.ContractUploadsRequest;
import com.checkmate.domain.contract.dto.response.ContractUploadResponse;
import com.checkmate.domain.contract.dto.response.FileNumberResponse;
import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contract.entity.EditStatus;
import com.checkmate.domain.contract.entity.SourceType;
import com.checkmate.domain.contract.repository.ContractRepository;
import com.checkmate.domain.contractcategory.entity.ContractCategory;
import com.checkmate.domain.contractcategory.service.ContractCategoryService;
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
public class ContractService {

    private final UserService userService;
    private final ContractCategoryService categoryService;
    private final ContractFileService contractFileService;
    private final ContractRepository contractRepository;

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

}
