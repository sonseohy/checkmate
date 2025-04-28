import  { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"

const AnalyzeUploadPage: React.FC = () => {
  const { template, subtype } = useParams<{template:string, subtype:string}>()
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)

  const onNext = () => {
    if (!file) return alert("파일을 선택해주세요.")
    navigate(`review`)
  }

  return (
    <section className="container px-4 py-16 mx-auto text-center">
      <h1 className="mb-8 text-3xl font-bold">
        {`${templateLabel(template)}를 업로드 해주세요`}
      </h1>
      <div className="max-w-md mx-auto">
        {/* 간단한 드래그 앤 드롭 UI */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-8 mb-4 border-2 border-dashed rounded-lg"
        >
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={e => e.target.files && setFile(e.target.files[0])}
          />
          {file && <p className="mt-2 text-sm">선택된 파일: {file.name}</p>}
        </motion.div>
        <button
          onClick={onNext}
          className="px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          다음
        </button>
      </div>
    </section>
  )
}

// helper: slug → 한글 라벨
function templateLabel(slug: string | undefined) {
  switch (slug) {
    case "employment":   return "근로계약서"
    case "real-estate":  return "부동산 매매 계약서"
    case "rental":       return "임대차 계약서"
    default:             return "계약서"
  }
}

export default AnalyzeUploadPage