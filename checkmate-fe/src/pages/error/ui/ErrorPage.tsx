import { Link } from 'react-router-dom';
import NotFoundImage from '@/assets/images/error/your-404-image.png';
import InvalidAccessImage from '@/assets/images/error/invalid-access.png'; // 직접 준비한 이미지 추가 필요

interface ErrorPageProps {
  title?: string;
  description?: string;
  type?: 'notfound' | 'invalid';
  imageSrc?: string; // 커스텀 이미지가 필요할 경우 직접 전달
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  title = '404 Not Found',
  description = '요청하신 페이지를 찾을 수 없습니다.',
  type = 'notfound',
  imageSrc,
}) => {
  const imageToShow =
    imageSrc || (type === 'invalid' ? InvalidAccessImage : NotFoundImage);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center md:flex-row md:text-left md:gap-20">
      <div className="flex justify-center md:w-1/2">
        <img
          src={imageToShow}
          alt="Error Illustration"
          className="max-w-xs md:max-w-md"
        />
      </div>
      <div className="flex flex-col items-center md:items-start md:w-1/2">
        <h1 className="mb-4 text-5xl font-bold">{title}</h1>
        <p className="mb-8 text-lg whitespace-pre-line">{description}</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
