package com.checkmate.global.common.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.util.StopWatch;
import io.micrometer.core.instrument.MeterRegistry;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class PdfProcessingService {

    private final MeterRegistry meterRegistry;

    /**
     * PDF 파일의 총 페이지 수 계산
     *
     * @param pdfStream PDF 파일 스트림
     * @return 페이지 수
     * @throws RuntimeException 계산 실패 시
     */
    public int countPages(InputStream pdfStream) {
        log.info("PDF 페이지 수 계산 시작");
        StopWatch sw = new StopWatch();
        sw.start();
        try (PDDocument document = PDDocument.load(pdfStream)) {
            int pages = document.getNumberOfPages();
            log.info("PDF 페이지 수 = {}", pages);
            return pages;
        } catch (Exception e) {
            log.error("PDF 페이지 수 계산 오류", e);
            throw new RuntimeException("PDF 페이지 계산 실패", e);
        } finally {
            if (sw.isRunning()) {
                sw.stop();
            }
            long duration = sw.getTotalTimeMillis();
            log.info("PDF 페이지 수 계산 완료 ({} ms)", duration);
            meterRegistry.timer("pdf_processing.count_pages.duration")
                    .record(duration, TimeUnit.MILLISECONDS);
        }
    }
}