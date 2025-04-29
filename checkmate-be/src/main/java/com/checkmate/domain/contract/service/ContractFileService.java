package com.checkmate.domain.contract.service;

import com.checkmate.domain.contract.dto.response.FileNumberResponse;
import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contract.repository.ContractFileRepository;
import com.checkmate.global.common.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ContractFileService {

    private final S3Service s3Service;
    private final ContractFileRepository contractFileRepository;

    public FileNumberResponse uploadContractFiles(Contract contract, List<MultipartFile> files) {
    }
}
