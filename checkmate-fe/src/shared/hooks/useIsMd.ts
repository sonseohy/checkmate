import { useState, useEffect } from 'react'

/**
 * 화면 너비 체크 훅 
 */
export default function useIsMd(): boolean {
  const [isMd, setIsMd] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  )

  useEffect(() => {
    const onResize = () => setIsMd(window.innerWidth >= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return isMd
}
