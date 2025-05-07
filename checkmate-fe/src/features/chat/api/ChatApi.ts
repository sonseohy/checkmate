export async function sendChatMessage(input: string): Promise<string> {
  // 임시 응답 시뮬레이션 (API 연동 전)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`AI 응답: "${input}"에 대한 답변입니다.`);
    }, 500);
  });
}
