const WritePreviewPage: React.FC = () => {
  return (
    <div className="container py-16 mx-auto space-y-6">
      <h1 className="text-2xl font-bold">작성된 계약서 미리보기</h1>
      <p className="text-gray-600">입력한 값이 반영된 계약서 내용을 여기에 렌더링합니다.</p>
      <div className="mt-4">
        <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
          PDF 다운로드
        </button>
      </div>
    </div>
  );
};

export default WritePreviewPage;