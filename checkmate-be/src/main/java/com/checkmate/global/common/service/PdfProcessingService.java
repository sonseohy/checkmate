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
     * PDF가 이미지 기반인지 텍스트 기반인지 판별
     * 페이지당 텍스트 문자 수로 판단
     *
     * @param pdfStream PDF 파일 스트림
     * @return 이미지 기반이면 true, 텍스트 기반이면 false
     * @throws RuntimeException PDF 분석 실패 시
     */
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

    /**
     * 이미지 기반 PDF 전처리
     * PDF 내 이미지를 추출하여 새로운 PDF 문서로 재구성
     *
     * @param pdfBytes PDF 파일 바이트 배열
     * @return 처리된 PDF 파일 바이트 배열
     * @throws RuntimeException 처리 실패 시
     */
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

    /**
     * 이미지를 PNG 바이트 배열로 변환
     *
     * @param image 변환할 BufferedImage
     * @return PNG 형식의 바이트 배열
     * @throws Exception 변환 실패 시
     */
    private byte[] toPngBytes(BufferedImage image) throws Exception {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", bos);
        return bos.toByteArray();
    }
}