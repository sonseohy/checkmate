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
