export interface SummarySection {
  title: string;
  items: string[];
}

/** “- 제목 · 항목” 패턴의 요약 문자열을 섹션 배열로 변환 */
export const parseSummary = (raw: string): SummarySection[] =>
  raw
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((block) => {
      const lines = block.split('\n').filter(Boolean);
      const title = lines[0].replace(/^-+\s*/, '').trim(); // "- 제목" → "제목"
      const items = lines.slice(1).map((l) => l.replace(/^[\s·]+/, '').trim()); // "  · 항목" → "항목"
      return { title, items };
    });
