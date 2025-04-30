import useIsMd from '@/shared/hooks/useIsMd'
import { desktopCardVariants, mobileCardVariants } from './cardVariants'

export function useCardVariants() {
  const isMd = useIsMd()
  return isMd ? desktopCardVariants : mobileCardVariants
}