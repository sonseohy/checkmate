// import { pdfjs } from 'react-pdf';

(async () => {
  const { pdfjs } = await import('react-pdf');
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
})();


import { useState, useEffect, useMemo } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
  Location,
} from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import {
  LuDownload,
  LuTrash2,
  LuPlus,
  LuMinus,
  LuChevronRight,
  LuChevronLeft,
} from 'react-icons/lu';
import { FaSignature } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  deleteContractDetail,
  getContractDetail,
  getContractownload,
} from '@/features/detail';
import { useMobile } from '@/shared';
import { SignatureRequestForm } from '@/features/e-sign';
import { getCategorName } from '@/shared';

/* ────────────────────────── 타입 ────────────────────────── */
interface Params {
  contractId: string;
  [key: string]: string | undefined;
}

/** location.state 여러 형태를 모두 허용 */
type LocationState =
  | {
      contract?: { category_id?: number };
      category_id?: number;

      fileName?: string;
    }
  | undefined;


const ContractPdfViewer: React.FC = () => {
  /* ─ 기본 훅 세팅 ─ */
  const isMobile = useMobile();
  const navigate = useNavigate();
  const { contractId } = useParams<Params>();

  const { state } = useLocation() as Location<LocationState>;

  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(isMobile ? 0.6 : 1);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const documentKey = useMemo(
    () => (pdfBlob ? URL.createObjectURL(pdfBlob) : 'empty'),
    [pdfBlob],
  );

  /* ─ PDF 가져오기 ─ */
  useEffect(() => {
    if (!contractId) return;
    (async () => {
      try {
        const blob = await getContractDetail(Number(contractId));
        setPdfBlob(blob);
      } catch {
        // console.error(err);
      }
    })();
  }, [contractId]);

  /* ─ 모바일 ↔ 데스크톱 축척 동기화 ─ */
  useEffect(() => {
    setScale(isMobile ? 0.6 : 1);
  }, [isMobile]);

  /* ─ 문서 로드 완료 ─ */
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  /* ─ 썸네일 클릭 ─ */
  const handleThumbnailClick = (page: number) => setPageNumber(page);

  /* ─ PDF 다운로드 ─ */
  const handlePdfDownload = async () => {
    // 1. WritePreviewPage가 이미 넘겨준 fileName이 있으면 그대로 사용
    if (state?.fileName) {
      return getContractownload(Number(contractId), state.fileName);
    }

    // 2. 없으면 예전 로직으로 category_id → 카테고리명
    const categoryId = state?.contract?.category_id ?? state?.category_id;

    const categoryName = getCategorName(categoryId ?? -1);
    getContractownload(Number(contractId), `${categoryName}.pdf`);
  };

  /* ─ 계약서 삭제 ─ */
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
        await Swal.fire(
          '삭제되었습니다.',
          '계약서가 삭제되었습니다.',
          'success',
        );
        navigate('/mypage');
      }
    } catch {
      // console.error('계약서 삭제 실패:', error);
    }
  };

  return (
    <div className="flex flex-col space-x-4">
      {/* ───────────── 컨트롤 바 ───────────── */}
      <div
        className="
          flex flex-wrap items-center justify-between
          gap-2 sm:gap-5 mx-3 my-3
        "
      >
        {/* 확대/축소 */}
        <div
          className={`flex items-center ${
            isMobile ? 'space-x-1' : 'space-x-2'
          }`}
        >
          <button
            onClick={() => setScale((s) => s - 0.1)}
            className={`py-1 bg-gray-200 rounded ${
              isMobile ? 'text-sm px-1' : 'text-md px-2'
            }`}
          >
            <LuMinus />
          </button>
          <span>{(scale * 100).toFixed(0)}%</span>
          <button
            onClick={() => setScale((s) => s + 0.1)}
            className={`py-1 bg-gray-200 rounded ${
              isMobile ? 'text-sm px-1' : 'text-md px-2'
            }`}
          >
            <LuPlus />
          </button>
        </div>

        {/* 페이지네이션 */}
        <div className="flex space-x-4 items-center">
          <button
            onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
            disabled={pageNumber <= 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 flex items-center justify-center"
          >
            {isMobile ? <LuChevronLeft size={18} /> : '이전'}
          </button>
          <span className="whitespace-nowrap">
            {pageNumber} / {numPages}
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
            disabled={pageNumber >= numPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 flex items-center justify-center"
          >
            {isMobile ? <LuChevronRight size={18} /> : '다음'}
          </button>
        </div>

        {/* 액션 아이콘 */}
        <div className="flex space-x-3">
          {isMobile ? (
            <div className="flex flex-row">
              <button
                onClick={() => setShowSignatureModal(true)}
                className="flex items-center p-2 text-sm"
                title="전자서명"
              >
                <FaSignature size={25} />
              </button>
              <button
                onClick={handlePdfDownload}
                className="flex items-center p-2 text-sm"
              >
                <LuDownload size={25} />
              </button>
              <button
                onClick={handleDeleteContract}
                className="flex items-center p-2"
              >
                <LuTrash2 size={25} />
              </button>
            </div>
          ) : (
            <div className="flex flex-row gap-2">
              <button
                onClick={() => setShowSignatureModal(true)}
                className="flex items-center p-2 border-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                전자서명
              </button>
              <button
                onClick={handlePdfDownload}
                className="flex items-center gap-1 p-2 border-1 rounded-lg"
              >
                파일 다운로드 <LuDownload size={20} />
              </button>
              <button
                onClick={handleDeleteContract}
                className="flex items-center gap-1 p-2 border-1 rounded-lg"
              >
                파일 삭제 <LuTrash2 size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ───────────── PDF 뷰어 ───────────── */}
      <div className={isMobile ? 'mt-1' : 'mt-2'}>
        {!pdfBlob ? (
          <div>PDF 불러오는 중…</div>
        ) : (
          <Document
            key={documentKey}
            file={pdfBlob}
            onLoadSuccess={onDocumentLoadSuccess}
            loading="로딩 중…"
          >
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
              {/* 썸네일 목록 */}
              <div
                className={
                  isMobile
                    ? 'w-full flex flex-row overflow-x-auto overflow-y-hidden max-w-full'
                    : 'w-60 overflow-y-auto overflow-x-hidden h-[845px] mr-3'
                }
              >
                {Array.from({ length: numPages }).map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleThumbnailClick(idx + 1)}
                    className={`cursor-pointer ${isMobile ? 'p-2' : ''} mb-2 ${
                      pageNumber === idx + 1 ? 'border-2 border-[#cccccc]' : ''
                    }`}
                  >
                    <Page
                      pageNumber={idx + 1}
                      scale={isMobile ? 0.2 : 0.4}
                      renderAnnotationLayer={false}
                    />
                  </div>
                ))}
              </div>

              {/* 본문 페이지 */}
              <div className="flex-1 flex justify-center items-start">
                <Page pageNumber={pageNumber} scale={scale} />
              </div>
            </div>
          </Document>
        )}
      </div>

      {/* ───────────── 전자서명 모달 ───────────── */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowSignatureModal(false)}
            >
              ✕
            </button>
            <SignatureRequestForm
              contractId={Number(contractId)}
              onSuccess={() => {
                toast.success('서명 요청이 성공적으로 전송되었습니다!');
                setShowSignatureModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractPdfViewer;
