import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { WritingProcess } from '@/widgets/write';
import {
  RealEstateIntro,
  EmploymentIntro,
  RentalIntro,
} from '@/features/write';
import { navigateInvalidAccess } from '@/shared/utils/navigation';
import { useEffect } from 'react';
import { MidCategory, SubCategory } from '@/features/categories';

// slug 타입
type Slug = 'contract' | 'certification' | 'order' | 'etc';

const introMap: Record<
  Slug,
  { fallbackTitle: string; Component: React.FC; videoUrl: string }
> = {
  contract: {
    fallbackTitle: '계약서 자동 작성',
    Component: RealEstateIntro,
    videoUrl: 'https://www.youtube.com/embed/REAL_ESTATE_ID',
  },
  certification: {
    fallbackTitle: '내용 증명 자동 작성',
    Component: EmploymentIntro,
    videoUrl: 'https://www.youtube.com/embed/EMPLOYMENT_ID',
  },
  order: {
    fallbackTitle: '지급 명령 자동 작성',
    Component: RentalIntro,
    videoUrl: 'https://www.youtube.com/embed/RENTAL_ID',
  },
  etc: {
    fallbackTitle: '기타 자동 작성',
    Component: RentalIntro,
    videoUrl: 'https://www.youtube.com/embed/RENTAL_ID',
  },
};

const WriteIntroPage: React.FC = () => {
  /* ───── URL & Router state ───── */
  const { mainCategorySlug } = useParams<{ mainCategorySlug: Slug }>();
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state?: {
      selectedMid?: MidCategory;
      selectedSub?: SubCategory;
    };
  };

  const cfg = mainCategorySlug ? introMap[mainCategorySlug] : undefined;

  /* 잘못된 접근 가드 */
  useEffect(() => {
    if (!cfg) navigateInvalidAccess(navigate);
  }, [cfg, navigate]);

  if (!cfg) return null;

  /* ───── 동적 타이틀 ───── */
  const subName = state?.selectedSub?.name; // ex) "근로계약"
  const title = subName
    ? `${subName} 자동 작성` // 원하는 형태
    : cfg.fallbackTitle; // 기존 매핑값

  const { Component: Intro, videoUrl } = cfg;

  return (
    <div className="container py-16 mx-auto space-y-16">
      {/* 섹션 1 : 템플릿 소개 */}
      <section className="px-4 text-center">
        <h1 className="mb-6 text-3xl font-bold">{title}</h1>
        <Intro />
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

      {/* 작성 시작 버튼 */}
      <div className="text-center">
        <Link
          to={`/write/${mainCategorySlug}/fill`}
          className="inline-block px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {subName ?? '계약서'} 작성 시작하기
        </Link>
      </div>
    </div>
  );
};

export default WriteIntroPage;
