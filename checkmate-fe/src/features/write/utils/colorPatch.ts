export function neutralizeOklch(
  root: Document,           // onclone 으로 넘어오는 문서
  fallback = '#000'         // 대체 색
) {
  /* 중복 호출 방지 */
  if ((root as any).__oklchPatched) return;
  (root as any).__oklchPatched = true;

  const view = root.defaultView!;
  const toKebab = (p: string) => p.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

  const PROPS = [
    'color',
    'backgroundColor',
    'borderColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
  ];

  const walker = root.createTreeWalker(root.documentElement, NodeFilter.SHOW_ELEMENT);
  let el = walker.currentNode as HTMLElement | null;

  while (el) {
    const cs = view.getComputedStyle(el);

    for (const prop of PROPS) {
      if (cs[prop as any]?.includes('oklch(')) {
        /* inline style 에 강제 덮어쓰기 */
        el.style.setProperty(toKebab(prop), fallback, 'important');
      }
    }
    el = walker.nextNode() as HTMLElement | null;
  }

  /* :root 에 정의돼 있는 CSS 변수도 한 번에 neutralize */
  const rs = view.getComputedStyle(root.documentElement);
  for (const name of rs) {
    const val = rs.getPropertyValue(name);
    if (val.includes('oklch(')) {
      root.documentElement.style.setProperty(name, fallback, 'important');
    }
  }
}