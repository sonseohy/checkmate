import os
import json
import pytest
from dotenv import load_dotenv
from langchain_ollama import OllamaLLM  # 업데이트된 임포트

# 테스트할 요약 함수
def generate_summary(text: str) -> str:
    """Generate a summary of the given text."""
    prompt = f"""
    You are an expert in simplifying complex legal and medical documents. Your task is to summarize the following document in a way that is easily understandable to the average person. Focus on the following:
    Keep it short & crisp
    1. Main purpose of the document (e.g., loan agreement, medical consent form) 3-4 lines
    2. Key terms and conditions in simple language
    3. Important deadlines or dates
    4. Main responsibilities or obligations of each party
    5. Any potential risks or important considerations for the reader

    Present the summary in bullet points, using plain language and avoiding legal jargon. If there are any crucial legal terms, explain them in parentheses.
    
    IMPORTANT: Provide your response in Korean language.

    Document text:
    {text[:4000]}

    Simplified Summary in Korean:
    """
    model = OllamaLLM(model="llama3")
    response = model.invoke(prompt)
    return response.strip()

# 테스트 케이스
def test_generate_summary():
    # 1. 입력 파일 읽기
    with open('fixtures/71.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
        input_text = data.get("text", "")
    
    # 입력 텍스트가 있는지 확인
    assert input_text, "입력 텍스트가 비어 있습니다."
    
    # 2. 요약 생성
    summary = generate_summary(input_text)
    
    # 3. 결과 확인
    assert summary, "요약 결과가 비어 있습니다."
    print("\n\n===== 요약 결과 =====")
    print(summary)
    print("=====================\n\n")
    
    # 4. 결과 저장 (선택 사항)
    with open('71_summary_result.txt', 'w', encoding='utf-8') as result_file:
        result_file.write(summary)
    
    # return True 제거 - pytest에서는 반환값이 없어야 함

# 직접 실행 코드
if __name__ == "__main__":
    # 환경 변수 로드 (필요한 경우)
    load_dotenv()
    
    # 테스트 실행
    test_generate_summary()  # 반환값을 사용하지 않음
    print("테스트 완료")