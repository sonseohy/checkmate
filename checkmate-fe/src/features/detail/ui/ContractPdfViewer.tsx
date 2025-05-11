// src/features/detail/ContractPdfViewer.tsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Document, Page } from 'react-pdf'
import { getContractDetail } from '@/features/detail' // your API 파일 위치


interface Params {
  contractId: string
  [key: string]: string | undefined
}

const ContractPdfViewer: React.FC = () => {
  const { contractId } = useParams<Params>();
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  //줌 
  const [scale, setScale] = useState(1.0)
  useEffect(() => {
    if (!contractId) return
    ;(async () => {
      try {
        const blob = await getContractDetail(Number(contractId))
        setPdfBlob(blob)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [contractId])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1)
  }

  return (
    <div className="p-4">
      {/* 줌 컨트롤 UI */}
      <div className="mb-2 flex justify-center items-center space-x-2">
        <button
          onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          축소
        </button>
        <span>{(scale * 100).toFixed(0)}%</span>
        <button
          onClick={() => setScale((s) => Math.min(2.0, s + 0.1))}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          확대
        </button>
      </div>

      {!pdfBlob && <p>PDF 불러오는 중…</p>}
      {pdfBlob && (
        <>
          <div className="flex justify-center">
            <Document
              file={pdfBlob}
              onLoadSuccess={onDocumentLoadSuccess}
              loading="로딩 중…"
            >
              <Page pageNumber={pageNumber} scale={scale} />
            </Document>
          </div>

          {/* 페이지 내비게이션 (기존) */}
          <div className="mt-4 flex items-center justify-center space-x-4">
            <button
              onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
              disabled={pageNumber <= 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              &lt; 이전
            </button>
            <span>
              {pageNumber} / {numPages}
            </span>
            <button
              onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
              disabled={pageNumber >= numPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              다음 &gt;
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ContractPdfViewer
