// src/features/detail/ContractPdfViewer.tsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Document, Page } from 'react-pdf'
import { getContractDetail, getContractownload } from '@/features/detail';
import { LuDownload, LuX } from "react-icons/lu";


interface Params {
  contractId: string;
  [key: string]: string | undefined;
}

const ContractPdfViewer: React.FC = () => {
  const { contractId } = useParams<Params>();
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [thumbnails, setThumbnails ] = useState<string[]>([]);

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

  //페이지 미리보기
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1);

    const thumbArray: string[] = [];
    for (let i = 1; i <= numPages; i++) {
      thumbArray.push(`page-${i}`);
    }
    setThumbnails(thumbArray);
  };
  const handleThumbnailClick = (page: number) => {
    setPageNumber(page);
  };

  // 다운로드
  const handlePdfDownload = () => {
    getContractownload(Number(contractId));
  };

  return (
    <div className="flex flex-col space-x-4">
      <div className='flex flex-row justify-between items-center my-3 gap-5'>
        {/* Zoom Controls */}
        <div className="flex justify-center space-x-2">
          <button onClick={() => setScale(scale - 0.1)} className="px-2 py-1 bg-gray-200 rounded">
            축소
          </button>
          <span>{(scale * 100).toFixed(0)}%</span>
          <button onClick={() => setScale(scale + 0.1)} className="px-2 py-1 bg-gray-200 rounded">
            확대
          </button>
        </div>
        {/* Pagination */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setPageNumber(Math.max(pageNumber - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded"
            disabled={pageNumber <= 1}
          >
            이전
          </button>
          <span>
            {pageNumber} / {numPages}
          </span>
          <button
            onClick={() => setPageNumber(Math.min(pageNumber + 1, numPages))}
            className="px-3 py-1 bg-gray-200 rounded"
            disabled={pageNumber >= numPages}
          >
            다음
          </button>
        </div>
        <div className='flex flex-row gap-3'>
          <button className='flex flex-row items-center justify-center gap-2 border-1 border-gray-200 p-2 rounded-xl' onClick={handlePdfDownload}>
            파일 다운로드
            <LuDownload size={30} />
          </button>
        
          <button className='flex flex-row items-center justify-center gap-2 border-1 border-gray-200 p-2 rounded-xl'>
            파일 삭제
            <LuX size={30}/>
          </button>
        </div>
      </div>

      <div className='flex flex-row h-200'>
        {/* PDF Thumbnails */}
        <div className="w-60 overflow-y-auto overflow-x-hidden ">
          {thumbnails.map((thumb, index) => (
            <div
              key={thumb}
              className="cursor-pointer p-2 mb-2 flex justify-center"
              onClick={() => handleThumbnailClick(index + 1)}
            >
              <Document file={pdfBlob}>
                <Page pageNumber={index + 1} scale={0.4} />
              </Document>
            </div>
          ))}
        </div>
        {/* PDF Main Viewer */}
        <div className="flex-1">
          <div className="flex justify-center items-center">
            {!pdfBlob && <div>PDF 불러오는 중…</div>}
            {pdfBlob && (
              <Document
                file={pdfBlob}
                onLoadSuccess={onDocumentLoadSuccess}
                loading="로딩 중…"
              >
                <Page pageNumber={pageNumber} scale={scale} />
              </Document>
            )}
          </div>
        </div>
      </div>  
    </div> 
  );
}

export default ContractPdfViewer
