import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface AnalysisResult {
  summary: string[]
  feedback: string[]
  explanation: { clause:string; plain:string }[]
}

const AnalyzeResultPage: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    // TODO: 백엔드 호출 → 분석 결과 가져오기
    setResult({
      summary: ["근로자: 김육비", "계약 기간: 2025.04.22 ~ 2025.10.21", /*…*/],
      feedback: ["계약 기간이 6개월로 퇴직금 조건인 1년 미만입니다.", /*…*/],
      explanation: [
        { clause:"제1조 (근로계약의 목적)", plain:"‘을’은 … 정리된 문서입니다." },
        // …
      ]
    })
  }, [])

  if (!result) return <p className="py-16 text-center">로딩 중…</p>

  return (
    <section className="container px-4 py-16 mx-auto space-y-12">
      <h1 className="text-3xl font-bold">근로계약서 분석결과</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          className="p-6 bg-white rounded-lg shadow"
        >
          <h2 className="mb-4 text-xl font-semibold">계약서 요약</h2>
          <ul className="space-y-1 list-disc list-inside">
            {result.summary.map((s,i) => <li key={i}>{s}</li>)}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          className="p-6 bg-white rounded-lg shadow"
        >
          <h2 className="mb-4 text-xl font-semibold">계약서 메이트해설</h2>
          <div className="space-y-4">
            {result.explanation.map((exp,i) => (
              <div key={i}>
                <h3 className="font-semibold">{exp.clause}</h3>
                <p>{exp.plain}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          className="p-6 bg-white rounded-lg shadow md:col-span-2"
        >
          <h2 className="mb-4 text-xl font-semibold">계약서 피드백</h2>
          <ul className="space-y-1 list-disc list-inside">
            {result.feedback.map((f,i) => <li key={i}>{f}</li>)}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

export default AnalyzeResultPage