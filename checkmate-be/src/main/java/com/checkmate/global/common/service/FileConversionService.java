package com.checkmate.global.common.service;

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
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileConversionService {

    private final MeterRegistry meterRegistry;

    public byte[] hwpToPdf(byte[] hwpBytes) {
        log.info("HWP→PDF 변환 시작 ({} bytes)", hwpBytes.length);
        StopWatch sw = new StopWatch();
        sw.start();
        Path tmpHwp = null;
        Path tmpPdf = null;
        try {
            tmpHwp = Files.createTempFile("checkmate-hwp-", ".hwp");
            Files.write(tmpHwp, hwpBytes);
            tmpPdf = Files.createTempFile("checkmate-pdf-", ".pdf");
            ProcessBuilder pb = new ProcessBuilder(
                    "soffice", "--headless",
                    "--convert-to", "pdf",
                    "--outdir", tmpPdf.getParent().toString(),
                    tmpHwp.toString()
            );
            Process process = pb.start();
            boolean finished = process.waitFor(30, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                throw new RuntimeException("HWP→PDF 변환 타임아웃");
            }
            return Files.readAllBytes(tmpPdf);
        } catch (Exception e) {
            log.error("HWP→PDF 변환 오류", e);
            throw new RuntimeException("HWP 파일 변환 실패", e);
        } finally {
            if (sw.isRunning()) {
                sw.stop();
            }
            long duration = sw.getTotalTimeMillis();
            log.info("HWP→PDF 변환 완료 ({} ms)", duration);
            meterRegistry.timer("file_conversion.duration", "type", "hwp_to_pdf")
                    .record(duration, TimeUnit.MILLISECONDS);
            try {
                if (tmpHwp != null) Files.deleteIfExists(tmpHwp);
                if (tmpPdf != null) Files.deleteIfExists(tmpPdf);
            } catch (Exception ex) {
                log.warn("임시 파일 삭제 실패", ex);
            }
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