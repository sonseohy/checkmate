import Swal from 'sweetalert2'; // 이미 있다면 생략 가능
import { useState } from 'react';
import { SignatureService } from '@/features/e-sign';

interface Props {
  contractId: number;
}

const SignatureRequestForm = ({ contractId }: Props) => {
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
    } catch (err: any) {
      console.error(err);
      setStatus('error');

      // ✅ 에러 메시지 파악
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
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={status === 'loading'}
      >
        요청 보내기
      </button>

      {status === 'success' && (
        <p className="text-green-600 mt-2">요청이 성공적으로 전송되었습니다!</p>
      )}
    </form>
  );
};

export default SignatureRequestForm;
