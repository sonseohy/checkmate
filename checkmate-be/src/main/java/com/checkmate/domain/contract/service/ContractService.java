package com.checkmate.domain.contract.service;

import com.checkmate.domain.contract.dto.request.ContractUploadsRequest;
import com.checkmate.domain.contract.dto.request.SignatureRequest;
import com.checkmate.domain.contract.dto.response.*;
import com.checkmate.domain.contract.entity.*;
import com.checkmate.domain.contract.repository.ContractRepository;
import com.checkmate.domain.contractcategory.entity.ContractCategory;
import com.checkmate.domain.contractcategory.service.ContractCategoryService;
import com.checkmate.domain.user.entity.User;
import com.checkmate.domain.user.service.UserService;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import com.checkmate.global.common.service.S3Service;
import com.dropbox.sign.api.SignatureRequestApi;
import com.dropbox.sign.model.SignatureRequestResponse;
import com.dropbox.sign.model.SignatureRequestSendRequest;
import com.dropbox.sign.model.SubSignatureRequestSigner;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContractService {

    private final UserService userService;
    private final ContractCategoryService categoryService;
    private final ContractFileService contractFileService;
    private final ContractRepository contractRepository;
    private final SignatureRequestApi signatureRequestApi;
    private final S3Service s3Service;

    @Value("${hs.client.id:}")
    private String clientId;

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
        User user = userService.findUserById(userId);
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

    @Transactional
    public ContractSignatureUploadResponse uploadAndRequestSignature(
            Integer userId,
            Integer contractId,
            SignatureRequest signer
    ) throws Exception {

        PdfMetadata meta = contractFileService.loadViewerPdfMetadata(userId, contractId);

        InputStream decrypted = s3Service.getDecryptedStream(
                meta.getFileUrl().split("\\?")[0].replaceFirst("https://[^/]+/", ""),
                meta.getIv(),
                meta.getShareA(),
                meta.getFileId()
        );

        Path tempPdf = Files.createTempFile("hs-sign-", ".pdf");
        try (OutputStream os = Files.newOutputStream(tempPdf)) {
            byte[] buffer = new byte[4096];
            int len;
            while ((len = decrypted.read(buffer)) != -1) {
                os.write(buffer, 0, len);
            }
        }

        SignatureRequestSendRequest sendRequest = new SignatureRequestSendRequest()
                .testMode(true)
                .clientId(clientId)
                .addFilesItem(tempPdf.toFile())
                .addSignersItem(new SubSignatureRequestSigner()
                        .name(signer.getName())
                        .emailAddress(signer.getEmail())
                        .order(0)
                );

        SignatureRequestResponse signatureResponse = signatureRequestApi
                .signatureRequestSend(sendRequest)
                .getSignatureRequest();
        String requestId = signatureResponse.getSignatureRequestId();

        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));
        contract.setSignatureRequestId(requestId);
        contract.setSignatureStatus(SignatureStatus.PENDING);
        contractRepository.save(contract);

        Files.deleteIfExists(tempPdf);

        return ContractSignatureUploadResponse.builder()
                .contractId(contract.getId())
                .createdAt(contract.getCreatedAt())
                .signatureRequestId(requestId)
                .build();
    }

}
