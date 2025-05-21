interface TemplateSectionSkeletonProps {
  sectionId?: string;
  itemCount?: number;
}

const TemplateSectionSkeleton: React.FC<TemplateSectionSkeletonProps> = ({
  sectionId,
  itemCount = 3,
}) => (
  <section
    id={sectionId}
    className="relative min-h-[100vh] w-full overflow-hidden snap-start bg-white animate-pulse"
  >
    <div className="flex flex-col items-center max-w-screen-xl px-4 py-12 mx-auto md:py-16">
      {/* Heading placeholder */}
      <div className="w-64 h-10 mb-10 bg-gray-300 rounded" />

      {/* Cards placeholder */}
      <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-3">
        {Array.from({ length: itemCount }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center space-y-4 p-4 h-60 bg-gray-100 rounded-2xl"
          >
            <div className="w-16 h-16 bg-gray-300 rounded-full" />
            <div className="w-32 h-6 bg-gray-300 rounded" />
            <div className="space-y-2">
              <div className="w-40 h-4 bg-gray-300 rounded" />
              <div className="w-40 h-4 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TemplateSectionSkeleton;
