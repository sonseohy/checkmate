/** 01012341234 → 010-1234-1234 (일반 전화도 대략 처리) */
export function formatPhone(str: string) {
  return str.replace(
    /\b(01[016789]|02|0[3-9]\d)[-. ]?(\d{3,4})[-. ]?(\d{4})\b/g,
    (_, a, b, c) => `${a}-${b}-${c}`,
  );
}

/** 9511111234567 또는 951111-1234567 → 951111-1234567 */
export function formatRRN(str: string) {
  return str.replace(/\b(\d{6})-?(\d{7})\b/g, '$1-$2');
}

/** 금액·면적(…원/…㎡) → 콤마 추가 */
export function formatMoneyArea(str: string) {
  return str.replace(
    /\b(\d{1,3}(?:\d{3})*)(?=(원정|원|㎡))/g,
    (_, num) => Number(num.replace(/,/g, '')).toLocaleString(),
  );
}

/** 한 줄 통합 포매터 */
export function prettifyLine(line: string) {
  let out = line;
  out = formatPhone(out);
  out = formatRRN(out);
  out = formatMoneyArea(out);
  return out;
}