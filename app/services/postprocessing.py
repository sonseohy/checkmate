import logging
import re
from bs4 import BeautifulSoup, NavigableString, Tag
from pykospacing import Spacing
from hanspell import spell_checker

try:
    from konlpy.tag import Okt
    _okt = Okt()
except Exception:
    _okt = None

logger = logging.getLogger(__name__)

# 초기화
_spacer = Spacing()
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
            pattern = r'\b' + r'\s*'.join(list(re.escape(c) for c in noun)) + r'\b'
            text = re.sub(pattern, noun, text)
    return text

def correct_paragraph(txt: str) -> str:
    spaced = _spacer(txt)
    try:
        res = spell_checker.check(spaced)
        checked = res.checked.strip()
    except Exception:
        checked = spaced
    normed = normalize_text(checked)
    return review_tokens(normed)

def reflow_sentences(lines: list) -> list:
    if not lines:
        return []
    out = []
    buf = lines[0]
    for line in lines[1:]:
        if not re.search(r'[\.\!\?]$', buf.strip()) and line.strip():
            buf = buf.rstrip() + ' ' + line.strip()
        else:
            out.append(buf)
            buf = line
    out.append(buf)
    return out

def parse_html_to_markdown(html_blocks):
    paragraphs = []
    for block in html_blocks:
        if not block or not block.strip():
            continue
        soup = BeautifulSoup(block, "html.parser")
        for element in soup.contents:
            if isinstance(element, NavigableString):
                text = element.strip()
                if text:
                    paragraphs.append(text)
            elif isinstance(element, Tag):
                if element.name == "table":
                    rows = [[cell.get_text(strip=True) for cell in tr.find_all(["th","td"])]
                            for tr in element.find_all("tr")]
                    if rows:
                        header = rows[0]
                        lines = ["| " + " | ".join(header) + " |",
                                 "|" + "|".join([" --- " for _ in header]) + "|"]
                        for row in rows[1:]:
                            lines.append("| " + " | ".join(row) + " |")
                        paragraphs.append("\n".join(lines))
                elif element.name == "figure":
                    img = element.find("img")
                    if img and img.has_attr("alt"):
                        alt = img["alt"].strip()
                        if alt:
                            paragraphs.append(alt)
                else:
                    text = element.get_text("\n\n", strip=True)
                    if text:
                        paragraphs.append(text)
    return "\n\n".join(paragraphs)

def postprocessing_pipeline(ocr_result: dict, contract_id: int) -> dict:
    """
    1) HTML → Markdown
    2) reflow → 교정 → 보존
    """
    logger.info(f"[{contract_id}] Postprocessing 시작")
    elements = ocr_result.get("elements", [])
    html_blocks = [e.get("content", {}).get("html", "") for e in elements]
    logger.info(f"[{contract_id}] HTML 블록 수: {len(html_blocks)}")

    md = parse_html_to_markdown(html_blocks)
    logger.info(f"[{contract_id}] Markdown 변환 완료 ({len(md.splitlines())}줄)")

    lines = reflow_sentences(md.splitlines())
    logger.info(f"[{contract_id}] 재조합된 줄 수: {len(lines)}")

    cleaned_lines = []
    in_code = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("```"):
            in_code = not in_code
            cleaned_lines.append(line)
        elif in_code or _table_line_pattern.match(line) or _separator_pattern.match(line) or not stripped:
            cleaned_lines.append(line)
        else:
            cleaned_lines.append(correct_paragraph(line))
    cleaned_md = "\n".join(cleaned_lines)
    logger.info(f"[{contract_id}] 후처리 완료")

    return {
        "markdown": md,
        "cleaned_markdown": cleaned_md
    }
