import { WritingProcess } from '@/widgets/write';

const WriteIntroPage: React.FC = () => {
  const title = '계약서 자동 작성';
  const videoUrl = 'https://www.youtube.com/embed/REAL_ESTATE_ID'; // 실제 영상 URL로 교체하세요

  return (
    <div className="container py-16 mx-auto space-y-16">
      {/* 섹션 1 : 템플릿 소개 */}
      <section className="px-4 text-center">
        <h1 className="mb-6 text-3xl font-bold">{title}</h1>
        <div className="space-y-4 text-gray-700">
          <p>
            계약서 자동 작성 페이지입니다.<br />
            계약 정보, 당사자 정보, 조건을 입력하시면<br />
            표준 양식에 맞춰 계약서를 완성할 수 있습니다.
          </p>
          <ul className="space-y-1 text-gray-600 list-disc list-inside">
            <li>계약 당사자 정보 입력</li>
            <li>계약 기간 및 조건 설정</li>
            <li>특약 사항 추가 가능</li>
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
            className="w-full h-full rounded-lg"
          />
        </div>
      </section>
    </div>
  );
};

export default WriteIntroPage;
