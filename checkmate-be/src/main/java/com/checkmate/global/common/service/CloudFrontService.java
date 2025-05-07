package com.checkmate.global.common.service;

import com.amazonaws.services.cloudfront.CloudFrontUrlSigner;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudFrontService {

    @Value("${aws.cloudfront.domain}")
    private String cfDomain;

    @Value("${aws.cloudfront.key-pair-id}")
    private String keyPairId;

    @Value("${aws.cloudfront.private-key-path}")
    private String privateKeyPath;

    public String generateSignedUrl(String resourcePath) {
        try {
            String resourceUrl = "https://" + cfDomain + resourcePath;
            log.debug("CloudFront Signed URL resourceUrl={}", resourceUrl);

            Date expiration = Date.from(
                    Instant.now().plus(10, ChronoUnit.MINUTES)
            );

            // 1) Load PEM file
            File pemFile = new File(privateKeyPath);
            log.debug("privateKeyPath='{}', exists={}, isFile={}, canRead={}",
                    privateKeyPath,
                    pemFile.exists(), pemFile.isFile(), pemFile.canRead());
            if (!pemFile.exists() || !pemFile.canRead()) {
                throw new IllegalStateException("Private key not found/readable: " + privateKeyPath);
            }
            String pem = Files.readString(pemFile.toPath(), StandardCharsets.US_ASCII);

            // 2) Strip BEGIN/END and whitespace, base64-decode
            String base64 = pem
                    .replaceAll("-----BEGIN (.*)-----", "")
                    .replaceAll("-----END (.*)-----", "")
                    .replaceAll("\\s+", "");
            byte[] der = Base64.getDecoder().decode(base64);

            // 3) Generate PrivateKey from DER
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(der);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            PrivateKey privateKey = kf.generatePrivate(spec);

            // 4) Sign
            return CloudFrontUrlSigner.getSignedURLWithCannedPolicy(
                    resourceUrl, keyPairId, privateKey, expiration
            );

        } catch (Exception e) {
            log.error("Failed to generate CloudFront signed URL", e);
            throw new RuntimeException("CloudFront Signed URL 생성 실패: " + e.getMessage(), e);
        }
    }
}
