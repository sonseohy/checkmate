import React from 'react'
import { useParams } from 'react-router-dom'

type AnalyzeParams = {
  template: 'real-estate' | 'employment' | 'rental'
}

const AnalyzePage: React.FC = () => {
  const { template } = useParams<AnalyzeParams>()

  const titleMap = {
    'real-estate': '부동산 매매 계약서 분석',
    employment:    '근로 계약서 분석',
    rental:        '임대차 계약서 분석',
  } as const

  return (
    <div className="container py-16 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">{titleMap[template!]}</h1>
      {/* TODO: 여기에 template별 분석 컴포넌트를 넣으세요. */}
      <p>여기에 "{template}" 템플릿 전용 분석 UI를 구현해주세요.</p>
    </div>
  )
}
export default AnalyzePage
