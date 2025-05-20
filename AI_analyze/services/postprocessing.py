import logging
import re
from collections import defaultdict

from bs4 import BeautifulSoup, NavigableString, Tag
from hanspell import spell_checker

try:
    from konlpy.tag import Okt

    _okt = Okt()
except Exception:
    _okt = None

logger = logging.getLogger(__name__)

_table_line_pattern = re.compile(r"^\s*\|.*\|\s*$")
_separator_pattern = re.compile(r"^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$")


def normalize_text(text: str) -> str:
    text = re.sub(r'_+', '', text)
    text = re.sub(r'\s*/\s*', '/', text)
    text = re.sub(r'\s*:\s*', ': ', text)
    text = re.sub(r'\s*-\s*', ' - ', text)
    text = re.sub(r'[�]', '', text)
    return text


def review_tokens(text: str) -> str:
    if _okt is None:
        return text
    nouns = _okt.nouns(text)
    for noun in set(nouns):
        if len(noun) > 1:
            pat = r'\b' + r'\s*'.join(re.escape(c) for c in noun) + r'\b'
            text = re.sub(pat, noun, text)
    return text


def correct_paragraph(txt: str) -> str:
    try:
        res = spell_checker.check(txt)
        checked = res.checked.strip()
    except Exception:
        checked = txt
    return review_tokens(normalize_text(checked))


def reflow_sentences(lines: list[str]) -> list[str]:
    """마침표·물음표·느낌표로 끝나지 않으면 다음 줄과 붙이는 재조합"""
    if not lines:
        return []
    out, buf = [], lines[0]
    for line in lines[1:]:
        if not re.search(r'[\.\!\?]$', buf.strip()) and line.strip():
            buf = buf.rstrip() + ' ' + line.strip()
        else:
            out.append(buf)
            buf = line
    out.append(buf)
    return out


def parse_html_to_markdown(html_blocks: list) -> str:
    paras: list[str] = []
    for i, block in enumerate(html_blocks):
        if not isinstance(block, str):
            logger.warning(f"Skipping non-str HTML block at idx {i}: {type(block)}")
            continue
        if not block.strip():
            continue

        soup = BeautifulSoup(block, "html.parser")
        for el in soup.contents:
            if isinstance(el, NavigableString):
                t = el.strip()
                if t: paras.append(t)
            elif isinstance(el, Tag):
                if el.name == "table":
                    rows = [[cell.get_text(strip=True) for cell in tr.find_all(["th", "td"])]
                            for tr in el.find_all("tr")]
                    if rows:
                        header = rows[0]
                        table_md = ["| " + " | ".join(header) + " |",
                                    "|" + "|".join([" --- "] * len(header)) + "|"]
                        for r in rows[1:]:
                            table_md.append("| " + " | ".join(r) + " |")
                        paras.append("\n".join(table_md))
                elif el.name == "figure":
                    img = el.find("img")
                    if img and img.get("alt"):
                        paras.append(img["alt"].strip())
                else:
                    t = el.get_text("\n\n", strip=True)
                    if t: paras.append(t)
    return "\n\n".join(paras)


def postprocessing_pipeline(ocr_result: dict, contract_id: int) -> list[dict]:
    """
    1) page_no 별 HTML 블록을 묶어서,
    2) Markdown 변환, 띄어쓰기·맞춤법 교정, 문장 단위 개행
    3) [{'contract_id', 'page_no', 'raw_markdown', 'cleaned_markdown'}, …] 형태 반환
    """
    logger.info(f"[{contract_id}] Postprocessing 시작")

    # 1) 페이지별 HTML 묶기
    pages: dict[int, list] = defaultdict(list)
    for elem in ocr_result.get("elements", []):
        # 실제 API 스펙에 따라 key 이름이 달라질 수 있음
        page_no = elem.get("content", {}).get("page_no",
                                              elem.get("page_no", 0))
        html = elem.get("content", {}).get("html")
        pages[page_no].append(html)

    results = []
    for page_no, blocks in sorted(pages.items()):
        # 2) Markdown 변환
        raw_md = parse_html_to_markdown(blocks)
        # 3) 라인 재조합 + 교정
        lines = reflow_sentences(raw_md.splitlines())
        cleaned_lines: list[str] = []
        in_code = False
        for ln in lines:
            s = ln.strip()
            if s.startswith("```"):
                in_code = not in_code
                cleaned_lines.append(ln)
            elif in_code \
                    or _table_line_pattern.match(ln) \
                    or _separator_pattern.match(ln) \
                    or not s:
                cleaned_lines.append(ln)
            else:
                cleaned_lines.append(correct_paragraph(ln))

        # **문장 단위로 빈 줄 개행** 하고 싶으면 join에 "\n\n" 사용
        cleaned_md = "\n\n".join(cleaned_lines)

        logger.info(f"[{contract_id}][page {page_no}] 후처리 완료 ({len(cleaned_lines)} 줄)")

        results.append({
            "contract_id": contract_id,
            "page_no": page_no,
            "raw_markdown": raw_md,
            "cleaned_markdown": cleaned_md,
        })

    return results
