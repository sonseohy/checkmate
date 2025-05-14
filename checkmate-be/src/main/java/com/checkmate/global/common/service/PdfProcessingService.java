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

    public boolean isImageBasedPdf(InputStream pdfStream) {
        log.info("PDF 기반 판별 시작");
        StopWatch sw = new StopWatch();
        sw.start();
        try (PDDocument document = PDDocument.load(pdfStream)) {
            String text = new PDFTextStripper().getText(document);
            int pageCount = document.getNumberOfPages();
            double avgChars = (double) text.replaceAll("\\s+", "").length() / pageCount;
            boolean result = avgChars < 50;
            log.info("PDF avgChars={} pageCount={} result={}", avgChars, pageCount, result);
            return result;
        } catch (Exception e) {
            log.error("PDF 기반 판별 오류", e);
            throw new RuntimeException("PDF 분석 실패", e);
        } finally {
            if (sw.isRunning()) {
                sw.stop();
            }
            long duration = sw.getTotalTimeMillis();
            log.info("PDF 기반 판별 완료 ({} ms)", duration);
            meterRegistry.timer("pdf_processing.is_image_based.duration")
                    .record(duration, TimeUnit.MILLISECONDS);
        }
    }

    public byte[] preprocessImageBasedPdf(byte[] pdfBytes) {
        log.info("이미지 기반 PDF 전처리 시작 ({} bytes)", pdfBytes.length);
        StopWatch sw = new StopWatch();
        sw.start();
        try (PDDocument srcDoc = PDDocument.load(new ByteArrayInputStream(pdfBytes));
             PDDocument dstDoc = new PDDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PDFRenderer renderer = new PDFRenderer(srcDoc);
            int pages = srcDoc.getNumberOfPages();
            for (int i = 0; i < pages; i++) {
                BufferedImage pageImage = renderer.renderImageWithDPI(i, 300);
                BufferedImage processedImage = pageImage;

                PDPage page = new PDPage(PDRectangle.A4);
                dstDoc.addPage(page);
                PDImageXObject pdImage = LosslessFactory.createFromImage(dstDoc, processedImage);
                PDPageContentStream contentStream = new PDPageContentStream(dstDoc, page);
                float scale = Math.min(
                        page.getMediaBox().getWidth() / pdImage.getWidth(),
                        page.getMediaBox().getHeight() / pdImage.getHeight()
                ) * 0.9f;
                float width = pdImage.getWidth() * scale;
                float height = pdImage.getHeight() * scale;
                float x = (page.getMediaBox().getWidth() - width) / 2;
                float y = (page.getMediaBox().getHeight() - height) / 2;
                contentStream.drawImage(pdImage, x, y, width, height);
                contentStream.close();
            }
            dstDoc.save(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("이미지 기반 PDF 전처리 오류", e);
            throw new RuntimeException("이미지 PDF 전처리 실패", e);
        } finally {
            if (sw.isRunning()) {
                sw.stop();
            }
            long duration = sw.getTotalTimeMillis();
            log.info("이미지 기반 PDF 전처리 완료 ({} ms)", duration);
            meterRegistry.timer("pdf_processing.preprocess_image_based.duration")
                    .record(duration, TimeUnit.MILLISECONDS);
        }
    }

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

    private byte[] toPngBytes(BufferedImage image) throws Exception {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", bos);
        return bos.toByteArray();
    }
}