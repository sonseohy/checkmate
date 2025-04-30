import { Link } from 'react-router-dom';
import NotFoundImage from '@/assets/images/not-found/your-404-image.png'; // 너가 업로드한 이미지 경로에 맞게 수정!

const NotFoundPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center md:flex-row md:text-left md:gap-20">
    {/* 왼쪽 이미지 */}
    <div className="flex justify-center md:w-1/2">
      <img
        src={NotFoundImage}
        alt="404 Not Found"
        className="max-w-xs md:max-w-md"
      />
    </div>

    {/* 오른쪽 텍스트 */}
    <div className="flex flex-col items-center md:items-start md:w-1/2">
      <h1 className="mb-4 text-5xl font-bold">404 not found</h1>
      <p className="mb-8 text-lg">
        요청하신 페이지를 찾을 수 없습니다.
        <br />
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        메인으로 돌아가기
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
