export interface SummarySection {
  title: string;
  items: string[];
}

/** “- 제목 · 항목” 패턴의 요약 문자열을 섹션 배열로 변환 */
export const parseSummary = (raw: string): SummarySection[] =>
  raw
    .split(/\n{2,}/) // 빈 줄 2개 이상 → 블록 분리
    .filter(Boolean)
    .map((block) => {
      const lines = block.split('\n').filter(Boolean);

      /* 제목 "- xxx" → "xxx" */
      const title = lines[0].replace(/^-+\s*/, '').trim();

      /* 항목 앞머리 기호 제거 ─ 여기만 수정 👇 */
      const bullet = /^[\s·•\-\*▶►▪▸◆]+/; // 추가: • - * 등
      const items = lines.slice(1).map((l) => l.replace(bullet, '').trim());

      return { title, items };
    });
