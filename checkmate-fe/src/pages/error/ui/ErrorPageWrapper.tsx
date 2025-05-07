import { useLocation } from 'react-router-dom';
import ErrorPage from './ErrorPage';

const ErrorPageWrapper = () => {
  const location = useLocation();
  const { title, description, type, imageSrc } = location.state || {};

  return (
    <ErrorPage
      title={title}
      description={description}
      type={type}
      imageSrc={imageSrc}
    />
  );
};

export default ErrorPageWrapper;
