import { WritingProcess } from '@/widgets/write';

const WriteIntroPage: React.FC = () => {
  const title = '계약서 자동 작성';
  // ✅ ‘/embed/동영상ID’ 형태로 교체
  const videoUrl = 'https://www.youtube.com/embed/XS7rlNfEht8';

  return (
    <div className="container py-16 mx-auto space-y-16">
      {/* 섹션 1 : 템플릿 소개 */}
      <section className="px-4 text-center">
        <h1 className="mb-6 text-3xl font-bold">{title}</h1>
        <div className="space-y-4 text-gray-700">
          <p>
            더 이상 계약서 작성에 시간을 낭비하지 마세요.
            <br />
            체크메이트로 10분 안에 완성해보세요! <br />
            표준 양식에 맞춰 계약서를 완성할 수 있습니다.
          </p>
          <ul className="space-y-1 text-gray-600 list-disc list-inside">
            <li>카테고리 선택</li>
            <li>작성 전 체크리스트 확인</li>
            <li>간편 작성 & 자동 저장</li>
            <li>전자서명 후 PDF로 다운</li>
          </ul>
        </div>
      </section>

      {/* 섹션 2 : 공통 기능 소개 */}
      <WritingProcess />

      {/* 섹션 3 : 가이드 영상 */}
      <section className="px-4 text-center">
        <h2 className="mb-4 text-2xl font-semibold">간단 가이드 영상</h2>
        <div className="w-full max-w-3xl mx-auto aspect-video">
          <iframe
            src={videoUrl}
            title={`${title} 가이드 영상`}
            allowFullScreen
            loading="lazy"
            className="w-full h-full rounded-lg"
          />
        </div>
      </section>
    </div>
  );
};

export default WriteIntroPage;
