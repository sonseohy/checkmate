import { Dialog } from '@headlessui/react';
import { NewsItem } from '@/features/news';

interface Props {
  article: NewsItem | null;
  onClose: () => void;
}

const NewsModal: React.FC<Props> = ({ article, onClose }) => {
  if (!article) return null;

  /* 기사 원문을 iframe 으로 보여 주는 방법 */
  return (
    <Dialog open={!!article} onClose={onClose} className="fixed inset-0 z-[60]">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow-lg">
          <div className="flex justify-between px-6 py-4 border-b">
            <Dialog.Title className="text-lg font-bold">
              <span dangerouslySetInnerHTML={{ __html: article.title }} />
            </Dialog.Title>
            <button onClick={onClose} className="text-xl leading-none">
              ✕
            </button>
          </div>

          {/* 방법 A) 기사 링크를 iframe 으로 (크로스도메인 차단 시 썸네일·내용만) */}
          <iframe
            src={article.originallink}
            title="news"
            className="w-full h-[70vh] border-0"
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default NewsModal;
