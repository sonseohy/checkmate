import Swal from 'sweetalert2';
import { useState } from 'react';
import { SignatureService } from '@/features/e-sign';

interface Props {
  contractId: number;
  onSuccess: () => void; // ✅ 추가
}

const SignatureRequestForm = ({ contractId, onSuccess }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await SignatureService.request(contractId, { name, email });
      setStatus('success');

      onSuccess(); // ✅ 부모에게 성공 알림
    } catch (err: any) {
      // console.error(err);
      setStatus('error');

      const code = err?.response?.data?.error?.code;
      if (code === 'FILE-001') {
        Swal.fire({
          icon: 'info',
          title: 'PDF 저장 필요',
          text: '먼저 PDF를 저장해주세요.',
          confirmButtonText: '확인',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '요청 실패',
          text: '전자서명 요청 중 문제가 발생했습니다. 다시 시도해주세요.',
          confirmButtonText: '확인',
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white rounded shadow max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold">전자서명 요청</h2>
      <div>
        <label className="block mb-1">이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block mb-1">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className={`
    px-4 py-2 rounded flex items-center justify-center gap-2
    ${
      status === 'loading'
        ? 'bg-blue-500 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700'
    }
    text-white
    
  `}
      >
        {status === 'loading' ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            전송 중…
          </>
        ) : (
          '요청 보내기'
        )}
      </button>
    </form>
  );
};

export default SignatureRequestForm;
