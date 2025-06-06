package com.checkmate.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {
    @Value("${aws.s3.access}")
    private String accessKey;
    @Value("${aws.s3.secret}")
    private String secretKey;
    @Value("${aws.s3.region}")
    private String region;

    /**
     * AWS S3 클라이언트 생성
     * 설정된 자격 증명과 리전으로 S3 클라이언트 생성
     *
     * @return 설정된 S3Client 인스턴스
     */
    @Bean
    public S3Client s3Client() {
        return S3Client.builder().region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }

}
