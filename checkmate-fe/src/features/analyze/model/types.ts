// OCR 한 줄 데이터
export interface OCRLine {
  ocr_id: number;
  ocr_text: string;
  page_no: number;
}

// OCR 조회 API 응답
export interface OCRFetchResponse {
  success: boolean;
  data: OCRLine[];
  error: string | null;
  timestamp: string;
}
