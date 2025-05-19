package com.checkmate.global.util;

import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DefaultDataBufferFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

public class CustomMultipartFile implements MultipartFile {
    private final byte[] fileContent;
    private final String fileName;
    private final String contentType;

    /**
     * 바이트 배열을 기반으로 MultipartFile 생성
     *
     * @param fileContent 파일 내용 바이트 배열
     * @param fileName 파일 이름
     * @param contentType 파일 MIME 타입
     */
    public CustomMultipartFile(byte[] fileContent, String fileName, String contentType) {
        this.fileContent = fileContent;
        this.fileName = fileName;
        this.contentType = contentType;
    }

    /**
     * 폼 필드 이름 반환
     *
     * @return 파일 이름
     */
    @Override
    public String getName() {
        return fileName;
    }

    /**
     * 원본 파일 이름 반환
     *
     * @return 파일 이름
     */
    @Override
    public String getOriginalFilename() {
        return fileName;
    }

    /**
     * 파일 콘텐츠 타입 반환
     *
     * @return 파일 MIME 타입
     */
    @Override
    public String getContentType() {
        return contentType;
    }

    /**
     * 파일이 비어있는지 확인
     *
     * @return 파일이 비어있으면 true, 아니면 false
     */
    @Override
    public boolean isEmpty() {
        return fileContent == null || fileContent.length == 0;
    }

    /**
     * 파일 크기 반환
     *
     * @return 바이트 단위 파일 크기
     */
    @Override
    public long getSize() {
        return fileContent.length;
    }

    /**
     * 파일 내용을 바이트 배열로 반환
     *
     * @return 파일 내용 바이트 배열
     */
    @Override
    public byte[] getBytes() {
        try{
            return fileContent;
        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }

    /**
     * 파일 내용을 읽을 수 있는 InputStream 반환
     *
     * @return 파일 내용을 위한 InputStream
     */
    @Override
    public InputStream getInputStream() throws IOException {
        return new ByteArrayInputStream(fileContent);
    }

    /**
     * 파일 내용을 지정된 파일로 전송
     *
     * @param dest 파일을 저장할 대상 파일
     */
    @Override
    public void transferTo(File dest) throws IOException {
        try (FileOutputStream fos = new FileOutputStream(dest)) {
            fos.write(fileContent);
        }
    }

    /**
     * DataBuffer를 MultipartFile로 변환
     *
     * @param dataBuffer 변환할 DataBuffer
     * @param fileName 파일 이름
     * @param contentType 파일 MIME 타입
     * @return 변환된 MultipartFile 인스턴스
     */
    public static MultipartFile convertToMultipartFile(DataBuffer dataBuffer, String fileName, String contentType) {
        byte[] bytes = new byte[dataBuffer.readableByteCount()];
        dataBuffer.read(bytes);
        MultipartFile multipartFile = new CustomMultipartFile(bytes, fileName, contentType);
        return multipartFile;
    }

    /**
     * 바이트 배열을 MultipartFile로 변환
     *
     * @param data 변환할 바이트 배열
     * @param fileName 파일 이름
     * @param contentType 파일 MIME 타입
     * @return 변환된 MultipartFile 인스턴스
     */
    public static MultipartFile convertToMultipartFile(byte[] data, String fileName, String contentType) {
        DataBuffer dataBuffer = convertByteArrayToDataBuffer(data);
        return convertToMultipartFile(dataBuffer, fileName, contentType);
    }

    /**
     * 바이트 배열을 DataBuffer로 변환
     *
     * @param bytes 변환할 바이트 배열
     * @return 변환된 DataBuffer 인스턴스
     */
    public static DataBuffer convertByteArrayToDataBuffer(byte[] bytes) {
        DefaultDataBufferFactory factory = new DefaultDataBufferFactory();
        return factory.wrap(bytes);
    }

}
