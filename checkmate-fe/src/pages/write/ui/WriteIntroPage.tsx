import { Link, useParams } from "react-router-dom"
import WritingProcess from "@/widgets/write/WritingProcess"
import {
  RealEstateIntro,
  EmploymentIntro,
  RentalIntro,
} from '@/features/write'

type Params = {
  template: "real-estate" | "employment" | "rental"
}

const introMap = {
  "real-estate": {
    title: "부동산 매매 계약서 자동 작성",
    Component: RealEstateIntro,
    videoUrl: "https://www.youtube.com/embed/REAL_ESTATE_ID",
  },
  employment: {
    title: "근로 계약서 자동 작성",
    Component: EmploymentIntro,
    videoUrl: "https://www.youtube.com/embed/EMPLOYMENT_ID",
  },
  rental: {
    title: "임대차 계약서 자동 작성",
    Component: RentalIntro,
    videoUrl: "https://www.youtube.com/embed/RENTAL_ID",
  },
} as const

const WriteIntroPage: React.FC = () => {
  const { template } = useParams<Params>()
  const cfg = template ? introMap[template] : undefined

  if (!cfg) {
    return (
      <div className="container py-16 mx-auto text-center text-red-500">
        잘못된 경로입니다.
      </div>
    )
  }

  const { title, Component: Intro, videoUrl } = cfg

  return (
    <div className="container py-16 mx-auto space-y-16">
      {/* 섹션1: 템플릿별 소개 */}
      <section className="px-4 text-center">
        <h1 className="mb-6 text-3xl font-bold">{title}</h1>
        <Intro />
      </section>

      {/* 섹션2: 공통 기능 소개 */}
      <WritingProcess />

      {/* 섹션3: 가이드 영상 */}
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
          to={`/write/${template}/fill`}
          className="inline-block px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          계약서 작성 시작하기
        </Link>
      </div>
    </div>
  )
}

export default WriteIntroPage
