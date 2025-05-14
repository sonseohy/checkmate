// src/features/detail/ContractPdfViewer.tsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import { deleteContractDetail, getContractDetail, getContractownload } from '@/features/detail';
import { LuDownload, LuX } from 'react-icons/lu';
import Swal from 'sweetalert2';

interface Params {
  contractId: string;
  [key: string]: string | undefined;
}

const ContractPdfViewer: React.FC = () => {
  const navigate = useNavigate();
  const { contractId } = useParams<Params>();
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  // 강제 리마운트를 위해 Blob URL을 key로 사용
  const documentKey = useMemo(() => {
    return pdfBlob ? URL.createObjectURL(pdfBlob) : 'empty';
  }, [pdfBlob]);

  useEffect(() => {
    if (!contractId) return;
    (async () => {
      try {
        const blob = await getContractDetail(Number(contractId));
        setPdfBlob(blob);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [contractId]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handleThumbnailClick = (page: number) => {
    setPageNumber(page);
  };

  const handlePdfDownload = () => {
    getContractownload(Number(contractId));
  };

  const handleDeleteContract = async () => {
    try {
      const result = await Swal.fire({
        title: '정말 삭제하시겠습니까?',
        text: '삭제 후에는 복구할 수 없습니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
      });
      if (result.isConfirmed) {
        await deleteContractDetail(Number(contractId));
        await Swal.fire('삭제되었습니다.', '계약서가 삭제되었습니다.', 'success');
        navigate('/mypage');
      }
    } catch (error) {
      console.error('계약서 삭제 실패:', error);
    }
  };

  return (
    <div className="flex flex-col space-x-4">
      {/* 컨트롤 버튼들 */}
      <div className="flex justify-between items-center my-3 gap-5 ml-3">
        {/* Zoom */}
        <div className="flex space-x-2 items-center">
          <button onClick={() => setScale((s) => s - 0.1)} className="px-2 py-1 bg-gray-200 rounded">
            축소
          </button>
          <span>{(scale * 100).toFixed(0)}%</span>
          <button onClick={() => setScale((s) => s + 0.1)} className="px-2 py-1 bg-gray-200 rounded">
            확대
          </button>
        </div>
        {/* Pagination */}
        <div className="flex space-x-4 items-center">
          <button
            onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
            disabled={pageNumber <= 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            이전
          </button>
          <span>
            {pageNumber} / {numPages}
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
            disabled={pageNumber >= numPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            다음
          </button>
        </div>
        {/* Download / Delete */}
        <div className="flex space-x-3">
          <button onClick={handlePdfDownload} className="flex items-center gap-2 border p-2 rounded-xl">
            파일 다운로드 <LuDownload size={20} />
          </button>
          <button onClick={handleDeleteContract} className="flex items-center gap-2 border p-2 rounded-xl">
            파일 삭제 <LuX size={20} />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="">
        {!pdfBlob ? (
          <div>PDF 불러오는 중…</div>
        ) : (
          <Document
            key={documentKey}
            file={pdfBlob}
            onLoadSuccess={onDocumentLoadSuccess}
            loading="로딩 중…"
          >
            <div className='flex flex-row '>
              {/* 썸네일 */}
              <div className="w-60 overflow-y-auto overflow-x-hidden h-[845px]">
                {Array.from({ length: numPages }).map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleThumbnailClick(idx + 1)}
                    className={`cursor-pointer p-2 mb-2 ${pageNumber === idx + 1 ? 'bg-gray-100' : ''}`}
                  >
                    <Page pageNumber={idx + 1} scale={0.4} renderAnnotationLayer={false} />
                  </div>
                ))}
              </div>

              {/* 메인 뷰 */}
              <div className="flex-1 flex justify-center items-start">
                <Page pageNumber={pageNumber} scale={scale} />
              </div>
            </div>
          </Document>
        )}
      </div>
    </div>
  );
};

export default ContractPdfViewer;
