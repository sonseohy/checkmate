// 스켈레톤 UI
const SkeletonCard: React.FC = () => (
  <div className="flex flex-col w-full h-40 p-3 my-2 bg-white rounded-lg shadow animate-pulse sm:h-auto sm:p-4">
    <div className="w-3/4 h-5 mb-2 bg-gray-300 rounded" />
    <div className="w-1/2 h-5 mb-3 bg-gray-300 rounded" />
    <div className="flex-1 space-y-1.5">
      <div className="w-full h-3.5 bg-gray-200 rounded" />
      <div className="w-5/6 h-3.5 bg-gray-200 rounded" />
      <div className="w-2/3 h-3.5 bg-gray-200 rounded" />
    </div>
    <div className="w-20 h-3.5 mt-3 bg-gray-200 rounded" />
  </div>
);

export default SkeletonCard;
