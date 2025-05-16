export const WriteStickyBar: React.FC<{
  onReset: () => void;
  isResetting: boolean;
  submitTargetId: string;
}> = ({ onReset, isResetting, submitTargetId }) => (
  <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b-2 border-gray-300
                  flex justify-end gap-3 py-3 px-4">
    <button
      type="button"
      onClick={onReset}
      disabled={isResetting}
      className="px-5 py-2 text-sm font-medium text-red-600 border border-red-500 rounded
                 hover:bg-red-50 disabled:opacity-50"
    >
      입력값 초기화
    </button>

    <button
      type="submit"
      form={submitTargetId}
      className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded
                 hover:bg-blue-700"
    >
      계약서 작성하기
    </button>
  </div>
);