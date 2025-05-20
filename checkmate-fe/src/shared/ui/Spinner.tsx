export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const cls = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }[size];
  return (
    <div
      className={`${cls} border-4 border-blue-600 border-t-transparent rounded-full animate-spin`}
    />
  );
};

/* 배경 포함한 전체 화면 버전 */

export const FullPageSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white">
    <img src="/logo.svg" alt="logo" className="h-12 animate-ping" />
  </div>
);
