// src/shared/ui/Header.tsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'

export interface HeaderProps {
  className?: string
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [writeOpen, setWriteOpen] = useState(false)
  const [analyzeOpen, setAnalyzeOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // 모바일 메뉴 닫힐 때 서브메뉴도 닫기
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
      {/* Logo 클릭 시 메인으로 이동 */}
      <Link to="/" className="flex items-center gap-2">
        <img src="/icons/favicon-96x96.png" alt="logo" className="w-6 h-6" />
      </Link>

      {/* Desktop Menu */}
      <div className="items-center hidden gap-8 text-sm font-semibold text-black md:flex">
        {/* 계약서 쓰기 */}
        <div className="relative">
          <button
            onClick={() => {
              setWriteOpen(w => !w)
              setAnalyzeOpen(false)
            }}
            className="flex items-center gap-1 hover:text-blue-600"
          >
            계약서 쓰기 
            <ChevronDown size={16} className={writeOpen ? 'rotate-180 transition-transform' : ''} />
          </button>
          {writeOpen && (
            <ul className="absolute left-0 z-10 w-40 mt-2 bg-white border rounded shadow-md top-full">
              <li>
                <Link
                  to="/write/real-estate"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setWriteOpen(false)}
                >
                  부동산매매 계약서
                </Link>
              </li>
              <li>
                <Link
                  to="/write/employment"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setWriteOpen(false)}
                >
                  근로계약서
                </Link>
              </li>
              <li>
                <Link
                  to="/write/rental"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setWriteOpen(false)}
                >
                  임대차 계약서
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* 계약서 분석 */}
        <div className="relative">
          <button
            onClick={() => {
              setAnalyzeOpen(a => !a)
              setWriteOpen(false)
            }}
            className="flex items-center gap-1 hover:text-blue-600"
          >
            계약서 분석 
            <ChevronDown size={16} className={analyzeOpen ? 'rotate-180 transition-transform' : ''} />
          </button>
          {analyzeOpen && (
            <ul className="absolute left-0 z-10 w-40 mt-2 bg-white border rounded shadow-md top-full">
              <li>
                <Link
                  to="/analyze/real-estate"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setAnalyzeOpen(false)}
                >
                  부동산매매 계약서
                </Link>
              </li>
              <li>
                <Link
                  to="/analyze/employment"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setAnalyzeOpen(false)}
                >
                  근로계약서
                </Link>
              </li>
              <li>
                <Link
                  to="/analyze/rental"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setAnalyzeOpen(false)}
                >
                  임대차 계약서
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* 회원가입 / 로그인 */}
        <Link to="/auth" className="text-sm font-normal text-gray-700 hover:text-black">
          회원가입 / 로그인
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="p-2 md:hidden"
        onClick={() => setMobileOpen(m => !m)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="absolute left-0 z-40 w-full bg-white border-b shadow-md top-full md:hidden">
          <div className="flex flex-col p-4 space-y-2">
            {/* 계약서 쓰기 모바일 */}
            <div className="relative">
              <button
                onClick={() => {
                  setWriteOpen(w => !w)
                  setAnalyzeOpen(false)
                }}
                className="flex justify-between w-full py-2 text-left hover:text-blue-600"
              >
                계약서 쓰기
                <ChevronDown size={16} className={writeOpen ? 'rotate-180 transition-transform' : ''} />
              </button>
              {writeOpen && (
                <ul className="pl-4">
                  <li>
                    <Link
                      to="/write/real-estate"
                      className="block py-1 hover:bg-gray-100"
                      onClick={() => setMobileOpen(false)}
                    >
                      부동산매매 계약서
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/write/employment"
                      className="block py-1 hover:bg-gray-100"
                      onClick={() => setMobileOpen(false)}
                    >
                      근로계약서
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/write/rental"
                      className="block py-1 hover:bg-gray-100"
                      onClick={() => setMobileOpen(false)}
                    >
                      임대차 계약서
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* 계약서 분석 모바일 */}
            <div className="relative">
              <button
                onClick={() => {
                  setAnalyzeOpen(a => !a)
                  setWriteOpen(false)
                }}
                className="flex justify-between w-full py-2 text-left hover:text-blue-600"
              >
                계약서 분석
                <ChevronDown size={16} className={analyzeOpen ? 'rotate-180 transition-transform' : ''} />
              </button>
              {analyzeOpen && (
                <ul className="pl-4">
                  <li>
                    <Link
                      to="/analyze/real-estate"
                      className="block py-1 hover:bg-gray-100"
                      onClick={() => setMobileOpen(false)}
                    >
                      부동산매매 계약서
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/analyze/employment"
                      className="block py-1 hover:bg-gray-100"
                      onClick={() => setMobileOpen(false)}
                    >
                      근로계약서
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/analyze/rental"
                      className="block py-1 hover:bg-gray-100"
                      onClick={() => setMobileOpen(false)}
                    >
                      임대차 계약서
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* 회원가입 / 로그인 모바일 */}
            <Link
              to="/auth"
              className="pt-4 text-center text-gray-700 border-t cursor-pointer hover:text-black"
              onClick={() => setMobileOpen(false)}
            >
              회원가입 / 로그인
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
