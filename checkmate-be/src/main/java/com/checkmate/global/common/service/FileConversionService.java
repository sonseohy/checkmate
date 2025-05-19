package com.checkmate.global.common.service;

import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;
import org.springframework.util.StopWatch;
import io.micrometer.core.instrument.MeterRegistry;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileConversionService {

    private final MeterRegistry meterRegistry;

    private final int timeoutSeconds = 30;
    private final String libreOfficePath = "libreoffice";
    private final int maxConcurrent = 3;

    private final Semaphore conversionSemaphore = new Semaphore(maxConcurrent);

    /**
     * LibreOffice 설치 및 실행 가능 여부 확인
     */
//    @PostConstruct
//    public void validateLibreOffice() {
//        try {
//            ProcessBuilder pb = new ProcessBuilder(libreOfficePath, "--version");
//            pb.redirectErrorStream(true);
//            Process process = pb.start();
//
//            if (!process.waitFor(5, TimeUnit.SECONDS) || process.exitValue() != 0) {
//                throw new RuntimeException("LibreOffice가 설치되지 않았거나 실행할 수 없습니다");
//            }
//
//            // 버전 정보 로그
//            try (BufferedReader reader = new BufferedReader(
//                    new InputStreamReader(process.getInputStream()))) {
//                String version = reader.lines().collect(Collectors.joining(" "));
//                log.info("LibreOffice 확인 완료: {}", version);
//            }
//
//        } catch (Exception e) {
//            log.error("LibreOffice 설치 확인 실패", e);
//            throw new RuntimeException("LibreOffice 설치 확인 실패", e);
//        }
//    }
    /**
     * HWP 파일을 PDF로 변환
     *
     * @param hwpBytes HWP 파일의 바이트 배열
     * @return 변환된 PDF 파일의 바이트 배열
     * @throws RuntimeException 변환 실패 시
     */
    public byte[] hwpToPdf(byte[] hwpBytes) throws IOException {
        if (hwpBytes == null || hwpBytes.length == 0) {
            throw new IllegalArgumentException("HWP 파일 데이터가 비어있습니다");
        }

        log.info("HWP→PDF 변환 시작 ({} bytes)", hwpBytes.length);
        StopWatch sw = new StopWatch();
        sw.start();

        Path tmpDir = null;
        String conversionId = UUID.randomUUID().toString().substring(0, 8);

        try {
            // 동시 변환 제한
            if (!conversionSemaphore.tryAcquire(10, TimeUnit.SECONDS)) {
                meterRegistry.counter("file_conversion.result",
                        "type", "hwp_to_pdf", "status", "queue_timeout").increment();
                throw new CustomException(ErrorCode.FILE_CONVERSION_QUEUE_TIMEOUT);
            }

            // 1) 임시 디렉터리 생성
            tmpDir = Files.createTempDirectory("checkmate-conv-" + conversionId + "-");
            log.debug("임시 디렉터리 생성: {}", tmpDir);

            // 2) input.hwp 파일로 저장
            Path tmpHwp = tmpDir.resolve("input.hwp");
            Files.write(tmpHwp, hwpBytes);
            log.debug("HWP 파일 저장 완료: {}", tmpHwp);

            // 3) LibreOffice CLI 호출
            ProcessBuilder pb = new ProcessBuilder(
                    libreOfficePath, "--headless",
                    "--invisible", "--nologo",
                    "--convert-to", "pdf",
                    "--outdir", tmpDir.toString(),
                    tmpHwp.toString()
            );

            // 환경변수 설정 (폰트 등)
            Map<String, String> env = pb.environment();
            env.put("HOME", "/tmp");

            pb.redirectErrorStream(true);
            Process process = pb.start();

            // 4) 비동기로 프로세스 출력 읽기 (데드락 방지)
            CompletableFuture<String> outputFuture = CompletableFuture.supplyAsync(() -> {
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(process.getInputStream()))) {
                    return reader.lines().collect(Collectors.joining("\n"));
                } catch (IOException e) {
                    return "출력 읽기 실패: " + e.getMessage();
                }
            });

            // 5) 타임아웃 대기
            if (!process.waitFor(timeoutSeconds, TimeUnit.SECONDS)) {
                process.destroyForcibly();
                process.waitFor(5, TimeUnit.SECONDS);

                meterRegistry.counter("file_conversion.result",
                        "type", "hwp_to_pdf", "status", "timeout").increment();
                throw new CustomException(ErrorCode.FILE_CONVERSION_TIMEOUT);
            }

            // 6) 프로세스 종료 코드 확인
            int exitCode = process.exitValue();
            if (exitCode != 0) {
                String output = "";
                try {
                    output = outputFuture.get(5, TimeUnit.SECONDS);
                } catch (Exception e) {
                    output = "출력 읽기 실패";
                }

                log.error("LibreOffice 변환 실패 (exit code: {}): {}", exitCode, output);
                meterRegistry.counter("file_conversion.result",
                        "type", "hwp_to_pdf", "status", "process_error").increment();
                throw new CustomException(ErrorCode.FILE_CONVERSION_PROCESS_ERROR);
            }

            // 7) 변환된 PDF 경로 확인
            Path outputPdf = tmpDir.resolve("input.pdf");
            if (!Files.exists(outputPdf)) {
                // 다른 이름으로 생성되었을 수도 있음
                try (Stream<Path> files = Files.list(tmpDir)) {
                    outputPdf = files
                            .filter(p -> p.toString().endsWith(".pdf"))
                            .findFirst()
                            .orElse(null);
                }

                if (outputPdf == null || !Files.exists(outputPdf)) {
                    String output = "";
                    try {
                        output = outputFuture.get(5, TimeUnit.SECONDS);
                    } catch (Exception e) {
                        output = "출력 읽기 실패";
                    }

                    log.error("변환된 PDF 파일을 찾을 수 없음. LibreOffice 출력: {}", output);
                    meterRegistry.counter("file_conversion.result",
                            "type", "hwp_to_pdf", "status", "no_output").increment();
                    throw new CustomException(ErrorCode.FILE_CONVERSION_NO_OUTPUT);
                }
            }

            // 8) PDF 바이트 읽어서 반환
            byte[] result = Files.readAllBytes(outputPdf);

            // 성공 메트릭
            meterRegistry.counter("file_conversion.result",
                    "type", "hwp_to_pdf", "status", "success").increment();
            meterRegistry.gauge("file_conversion.input_size", hwpBytes.length);
            meterRegistry.gauge("file_conversion.output_size", result.length);

            log.info("HWP→PDF 변환 성공 (입력: {} bytes, 출력: {} bytes)",
                    hwpBytes.length, result.length);

            return result;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            meterRegistry.counter("file_conversion.result",
                    "type", "hwp_to_pdf", "status", "interrupted").increment();
            throw new RuntimeException("HWP→PDF 변환 중 인터럽트 발생", e);

        } catch (Exception e) {
            if (e instanceof RuntimeException && e.getMessage().contains("변환")) {
                throw e;
            }

            log.error("HWP→PDF 변환 오류", e);
            meterRegistry.counter("file_conversion.result",
                    "type", "hwp_to_pdf", "status", "error").increment();
            throw new CustomException(ErrorCode.FILE_CONVERSION_FAILED);

        } finally {
            // 세마포어 해제
            conversionSemaphore.release();

            // 성능 메트릭 기록
            if (sw.isRunning()) sw.stop();
            long duration = sw.getTotalTimeMillis();
            log.info("HWP→PDF 변환 완료 ({} ms)", duration);
            meterRegistry.timer("file_conversion.duration", "type", "hwp_to_pdf")
                    .record(duration, TimeUnit.MILLISECONDS);

            // 임시 디렉터리 정리
            if (tmpDir != null) {
                cleanupTempDirectory(tmpDir);
            }
        }
    }

    private void cleanupTempDirectory(Path tmpDir) {
        try (Stream<Path> paths = Files.walk(tmpDir)) {
            paths.sorted(Comparator.reverseOrder())
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException e) {
                            log.warn("임시 파일 삭제 실패: {}", path, e);
                        }
                    });
        } catch (IOException e) {
            log.warn("임시 디렉터리 정리 실패: {}", tmpDir, e);
        }
    }

    public byte[] imageToPdf(byte[] imageBytes) {
        log.info("Image→PDF 변환 시작 ({} bytes)", imageBytes.length);
        StopWatch sw = new StopWatch();
        sw.start();
        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);
            BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
            PDImageXObject pdImage = LosslessFactory.createFromImage(document, image);
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                float scale = Math.min(
                        page.getMediaBox().getWidth() / pdImage.getWidth(),
                        page.getMediaBox().getHeight() / pdImage.getHeight()
                ) * 0.9f;
                float width = pdImage.getWidth() * scale;
                float height = pdImage.getHeight() * scale;
                float x = (page.getMediaBox().getWidth() - width) / 2;
                float y = (page.getMediaBox().getHeight() - height) / 2;
                contentStream.drawImage(pdImage, x, y, width, height);
            }
            document.save(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Image→PDF 변환 오류", e);
            throw new RuntimeException("이미지 PDF 변환 실패", e);
        } finally {
            if (sw.isRunning()) {
                sw.stop();
            }
            long duration = sw.getTotalTimeMillis();
            log.info("Image→PDF 변환 완료 ({} ms)", duration);
            meterRegistry.timer("file_conversion.duration", "type", "image_to_pdf")
                    .record(duration, TimeUnit.MILLISECONDS);
        }
    }
}