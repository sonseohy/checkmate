// src/shared/ui/Header.tsx
import { useState, useEffect } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'

export interface HeaderProps {
  className?: string
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [writeOpen, setWriteOpen] = useState(false)
  const [analyzeOpen, setAnalyzeOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close submenus when mobile menu closes
  useEffect(() => {
    if (!mobileOpen) {
      setWriteOpen(false)
      setAnalyzeOpen(false)
    }
  }, [mobileOpen])

  return (
    <header
      className={`
        sticky top-0 z-50 flex items-center justify-between
        w-full h-16 px-6 bg-white shadow ${className}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/icons/favicon-96x96.png" alt="logo" className="w-6 h-6" />
      </div>

      {/* Desktop Menu */}
      <div className="items-center hidden gap-8 text-sm font-semibold text-black md:flex">
        {/* 계약서 쓰기 */}
        <div className="relative">
          <button
            onClick={() => {
              setWriteOpen(prev => !prev)
              setAnalyzeOpen(false)
            }}
            className="flex items-center gap-1 hover:text-blue-600"
          >
            계약서 쓰기 <ChevronDown size={16} className={writeOpen ? 'rotate-180 transition-transform' : ''} />
          </button>
          {writeOpen && (
            <ul className="absolute left-0 z-10 w-40 mt-2 bg-white border rounded shadow-md top-full">
              <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">부동산매매 계약서</li>
              <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">근로계약서</li>
              <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">임대차 계약서</li>
            </ul>
          )}
        </div>

        {/* 계약서 분석 */}
        <div className="relative">
          <button
            onClick={() => {
              setAnalyzeOpen(prev => !prev)
              setWriteOpen(false)
            }}
            className="flex items-center gap-1 hover:text-blue-600"
          >
            계약서 분석 <ChevronDown size={16} className={analyzeOpen ? 'rotate-180 transition-transform' : ''} />
          </button>
          {analyzeOpen && (
            <ul className="absolute left-0 z-10 w-40 mt-2 bg-white border rounded shadow-md top-full">
              <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">부동산매매 계약서</li>
              <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">근로계약서</li>
              <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">임대차 계약서</li>
            </ul>
          )}
        </div>

        {/* 회원가입 / 로그인 */}
        <div className="text-sm font-normal text-gray-700 cursor-pointer hover:text-black">
          회원가입 / 로그인
        </div>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="p-2 md:hidden"
        onClick={() => setMobileOpen(prev => !prev)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="absolute left-0 z-40 w-full bg-white border-b shadow-md top-full md:hidden">
          <div className="flex flex-col p-4 space-y-2">
            {/* 계약서 쓰기 */}
            <div className="relative">
              <button
                onClick={() => {
                  setWriteOpen(prev => !prev)
                  setAnalyzeOpen(false)
                }}
                className="flex items-center justify-between w-full py-2 text-left hover:text-blue-600"
              >
                계약서 쓰기 <ChevronDown size={16} className={writeOpen ? 'rotate-180 transition-transform' : ''} />
              </button>
              {writeOpen && (
                <ul className="pl-4">
                  <li className="py-1 cursor-pointer hover:bg-gray-100">부동산매매 계약서</li>
                  <li className="py-1 cursor-pointer hover:bg-gray-100">근로계약서</li>
                  <li className="py-1 cursor-pointer hover:bg-gray-100">임대차 계약서</li>
                </ul>
              )}
            </div>

            {/* 계약서 분석 */}
            <div className="relative">
              <button
                onClick={() => {
                  setAnalyzeOpen(prev => !prev)
                  setWriteOpen(false)
                }}
                className="flex items-center justify-between w-full py-2 text-left hover:text-blue-600"
              >
                계약서 분석 <ChevronDown size={16} className={analyzeOpen ? 'rotate-180 transition-transform' : ''} />
              </button>
              {analyzeOpen && (
                <ul className="pl-4">
                  <li className="py-1 cursor-pointer hover:bg-gray-100">부동산매매 계약서</li>
                  <li className="py-1 cursor-pointer hover:bg-gray-100">근로계약서</li>
                  <li className="py-1 cursor-pointer hover:bg-gray-100">임대차 계약서</li>
                </ul>
              )}
            </div>

            {/* 회원가입 / 로그인 */}
            <div className="pt-4 text-center text-gray-700 border-t cursor-pointer hover:text-black">
              회원가입 / 로그인
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
