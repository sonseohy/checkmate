/** 서버에서 내려오는 options(배열 or JSON) 파싱 */
export const parseOptions = (options: string[] | string | null): string[] =>
  Array.isArray(options)
    ? options
    : options
    ? JSON.parse(options)
    : [];