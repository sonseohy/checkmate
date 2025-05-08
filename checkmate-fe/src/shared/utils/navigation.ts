import { NavigateFunction } from 'react-router-dom';

// 에러 이동 유틸 함수
export const navigateInvalidAccess = (navigate: NavigateFunction) => {
  navigate('/error', {
    state: {
      title: '잘못된 접근입니다',
      description: '카테고리를 다시 선택해주세요.',
      type: 'invalid',
    },
  });
};

// 로그인 실패 시 에러 페이지로 이동하는 유틸 함수
export const navigateLoginError = (
  navigate: NavigateFunction,
  message?: string,
) => {
  navigate('/error', {
    state: {
      title: '로그인에 실패했습니다',
      description: message ?? '다시 시도해 주세요.',
      type: 'invalid',
    },
  });
};
