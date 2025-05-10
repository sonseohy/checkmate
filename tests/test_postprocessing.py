import warnings
# DeprecationWarning from pykospacing 경고 무시
warnings.filterwarnings("ignore", category=DeprecationWarning, module="pykospacing")

import json
from pathlib import Path
import re
import pytest
from bs4 import BeautifulSoup, NavigableString, Tag
from pykospacing import Spacing
from hanspell import spell_checker
try:
    from konlpy.tag import Okt
    _okt = Okt()
except Exception:
    _okt = None  # JVM unavailable, skip token review

# 1) KoSpacing 띄어쓰기 교정기 초기화
_spacer = Spacing()

# 정규표현식: 테이블 헤더/구분선/행 패턴
_table_line_pattern = re.compile(r"^\s*\|.*\|\s*$")
_separator_pattern = re.compile(r"^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$")


def normalize_text(text: str) -> str:
    """
    공백·구두점 및 특수문자 정규화
    """
    text = re.sub(r'_+', '', text)
    text = re.sub(r'\s*/\s*', '/', text)
    text = re.sub(r'\s*:\s*', ': ', text)
    text = re.sub(r'\s*-\s*', ' - ', text)
    text = re.sub(r'[�]', '', text)
    return text


def review_tokens(text: str) -> str:
    """
    형태소 분석을 통해 합성어가 분절된 경우 다시 합치는 함수
    예: "근 무 장 소" -> "근무장소"
    JVM이 없으면 그대로 반환
    """
    if _okt is None:
        return text
    nouns = _okt.nouns(text)
    for noun in set(nouns):
        if len(noun) > 1:
            pattern = r'\b' + r'\s*'.join(list(re.escape(c) for c in noun)) + r'\b'
            text = re.sub(pattern, noun, text)
    return text


def correct_paragraph(txt: str) -> str:
    """
    KoSpacing + python-hanspell → normalize → token review
    """
    spaced = _spacer(txt)
    try:
        res = spell_checker.check(spaced)
        checked = res.checked.strip()
    except Exception:
        checked = spaced
    normed = normalize_text(checked)
    return review_tokens(normed)


def reflow_sentences(lines: list) -> list:
    """
    문장 종결기호 기준으로 줄 재조합
    """
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
    """
    HTML 블록에서 Markdown 텍스트와 테이블 추출
    """
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
                        lines = []
                        lines.append("| " + " | ".join(header) + " |")
                        lines.append("|" + "|".join([" --- " for _ in header]) + "|")
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


def postprocess_markdown_by_paragraph(raw_md: str) -> str:
    """
    전체 Markdown 후처리: reflow → 교정 → 보존
    """
    orig_lines = raw_md.splitlines()
    lines = reflow_sentences(orig_lines)
    out = []
    in_code = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("```"):
            in_code = not in_code
            out.append(line)
            continue
        if in_code or _table_line_pattern.match(line) or _separator_pattern.match(line) or not stripped:
            out.append(line)
        else:
            out.append(correct_paragraph(line))
    return "\n".join(out)

@pytest.fixture
def ocr_json():
    path = Path(__file__).parent / "fixtures" / "62.json"
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def test_full_pipeline(ocr_json):
    html_blocks = [elem.get("content", {}).get("html", "")
                   for elem in ocr_json.get("elements", [])]
    markdown = parse_html_to_markdown(html_blocks)
    cleaned = postprocess_markdown_by_paragraph(markdown)
    assert isinstance(cleaned, str)
    assert cleaned.strip() != ""
    print("--- RAW MARKDOWN ---")
    print(markdown)
    print("--- CLEANED MARKDOWN ---")
    print(cleaned)
