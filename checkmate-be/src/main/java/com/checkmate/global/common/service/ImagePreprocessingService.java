package com.checkmate.global.common.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StopWatch;
import io.micrometer.core.instrument.MeterRegistry;
import org.bytedeco.javacv.OpenCVFrameConverter;
import org.bytedeco.javacv.Java2DFrameConverter;
import org.bytedeco.javacv.Frame;
import org.bytedeco.opencv.opencv_core.Mat;
import static org.bytedeco.opencv.global.opencv_imgproc.equalizeHist;
import static org.bytedeco.opencv.global.opencv_imgproc.medianBlur;

import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImagePreprocessingService {

    private final MeterRegistry meterRegistry;

    public byte[] preprocessForOcr(byte[] imageBytes) {
        log.info("이미지 전처리 시작 ({} bytes)", imageBytes.length);
        StopWatch sw = new StopWatch();
        sw.start();
        try {
            BufferedImage original = ImageIO.read(new ByteArrayInputStream(imageBytes));
            BufferedImage gray       = toGray(original);
            BufferedImage contrast   = enhanceContrast(gray);
            BufferedImage denoised   = removeNoise(contrast);
            BufferedImage resized    = resizeImage(denoised);
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            ImageIO.write(resized, "png", bos);
            return bos.toByteArray();
        } catch (Exception e) {
            log.error("이미지 전처리 오류", e);
            throw new RuntimeException("이미지 전처리 실패", e);
        } finally {
            if (sw.isRunning()) sw.stop();
            long duration = sw.getTotalTimeMillis();
            log.info("이미지 전처리 완료 ({} ms)", duration);
            meterRegistry.timer("image_preprocessing.duration")
                    .record(duration, TimeUnit.MILLISECONDS);
        }
    }

    private BufferedImage toGray(BufferedImage src) {
        BufferedImage gray = new BufferedImage(src.getWidth(), src.getHeight(), BufferedImage.TYPE_BYTE_GRAY);
        Graphics2D g = gray.createGraphics();
        g.drawImage(src, 0, 0, null);
        g.dispose();
        return gray;
    }

    private BufferedImage enhanceContrast(BufferedImage src) {
        OpenCVFrameConverter.ToMat matConverter   = new OpenCVFrameConverter.ToMat();
        Java2DFrameConverter java2dConverter     = new Java2DFrameConverter();
        Frame srcFrame                           = java2dConverter.convert(src);
        Mat mat                                  = matConverter.convert(srcFrame);
        Mat equalized                            = new Mat();
        equalizeHist(mat, equalized);
        Frame eqFrame                            = matConverter.convert(equalized);
        return java2dConverter.convert(eqFrame);
    }

    private BufferedImage removeNoise(BufferedImage src) {
        OpenCVFrameConverter.ToMat matConverter   = new OpenCVFrameConverter.ToMat();
        Java2DFrameConverter java2dConverter     = new Java2DFrameConverter();
        Frame srcFrame                           = java2dConverter.convert(src);
        Mat mat                                  = matConverter.convert(srcFrame);
        Mat dst                                  = new Mat();
        medianBlur(mat, dst, 3);
        Frame dstFrame                           = matConverter.convert(dst);
        return java2dConverter.convert(dstFrame);
    }

    private BufferedImage resizeImage(BufferedImage src) {
        int     width       = src.getWidth();
        int     height      = src.getHeight();
        int     targetWidth = 1024;
        int     targetHeight= (int) (height * (1024.0 / width));
        BufferedImage resized = new BufferedImage(targetWidth, targetHeight, src.getType());
        Graphics2D g          = resized.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.drawImage(src, 0, 0, targetWidth, targetHeight, null);
        g.dispose();
        return resized;
    }
}
