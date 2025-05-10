import pytest
import re
import json
from pathlib import Path
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

# 계약 요약용 Gemma 모델
MODEL_ID = "RangDev/gemma-2b-it-legal-sum-ko"

# 간단 문장 분리 함수

def simple_sent_split(text: str) -> list[str]:
    """마침표·물음표·감탄표 기준으로 분할"""
    return re.split(r'(?<=[\.\!\?])\s+', text.strip())

@pytest.fixture(scope="module")
def summarizer():
    # 1) tokenizer & causal LM 모델 로드 (remote code 허용)
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(MODEL_ID, trust_remote_code=True)
    model.eval()
    if torch.cuda.is_available():
        model.cuda()

    # 2) text-generation 파이프라인 생성
    gen = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        trust_remote_code=True,
        device=0 if torch.cuda.is_available() else -1,
    )

    def _summarize(text: str) -> str:
        # 3) 문장 단위로 청크 분할 (토크나이즈 기준 약 450 토큰)
        sents = simple_sent_split(text)
        chunks, cur, cur_len = [], [], 0
        for sent in sents:
            l = len(tokenizer.tokenize(sent))
            if cur_len + l > 1000 and cur:
                chunks.append(" ".join(cur))
                cur, cur_len = [], 0
            cur.append(sent)
            cur_len += l
        if cur:
            chunks.append(" ".join(cur))

        # 4) 각 청크 요약
        summaries = []
        for chunk in chunks:
            prompt = "이 계약서에서 핵심 조항(목적, 의무, 지급·기간·위험·해제조건 등)을 항목별로 요약해줘: " + chunk
            out = gen(
                prompt,
                max_new_tokens=150,
                num_beams=8,
                no_repeat_ngram_size=4,
                length_penalty=1.2,
                return_full_text=False,
            )
            summaries.append(out[0]["generated_text"].strip())

        # 5) 요약문 합쳐서 재요약
        merged = " ".join(summaries)
        prompt = "summarize: " + merged
        final_out = gen(
            prompt,
            max_new_tokens=500,
            num_beams=8,
            no_repeat_ngram_size=4,
            length_penalty=1.2,
            return_full_text=False,
        )
        return final_out[0]["generated_text"].strip()

    return _summarize


def test_chunked_summarization(summarizer):
    # fixtures/62_analysis.json 에 긴 계약 텍스트를 넣어두세요
    data = json.loads(
        (Path(__file__).parent / "62_analysis.json").read_text(encoding="utf-8")
    )
    text = data["text"]

    summary = summarizer(text)
    print("--- SUMMARY ---")
    print(summary)

    assert isinstance(summary, str)
    assert len(summary) > 200  # 최소 길이 검증