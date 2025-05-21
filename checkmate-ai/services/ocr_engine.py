import httpx

from config.settings import (
    UPSTAGE_OCR_API_URL, UPSTAGE_OCR_API_KEY,
)


class OcrEngine:
    def __init__(self):
        self.url = UPSTAGE_OCR_API_URL
        self.api_key = UPSTAGE_OCR_API_KEY

    async def recognize(self, pdf_bytes: bytes) -> dict:
        headers = {
            "Authorization": f"Bearer {self.api_key}"
        }

        data = {
            "ocr": "auto",
            "base64_encoding": "['table']",
            "model": "document-parse"
        }
        files = {
            "document": ("contract.pdf", pdf_bytes, "application/pdf")
        }

        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(
                self.url,
                headers=headers,
                data=data,
                files=files
            )
            resp.raise_for_status()
            return resp.json()
