import openai
from app.models.prompts import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE
from app.config import settings

# OpenAI 키 설정
openai.api_key = settings.OPENAI_API_KEY

async def generate_summary(all_text: str) -> str:
    """
    전체 문서를 하나의 문자열로 받아서
    ChatGPT에 요약을 요청하고, 결과를 반환합니다.
    """
    user_content = USER_PROMPT_TEMPLATE.format(all_text=all_text[:10000]) 

    resp = await openai.ChatCompletion.acreate(
        model="gpt-4.1-nano",
        messages=[
            {"role": "system",  "content": SYSTEM_PROMPT},
            {"role": "user",    "content": user_content},
        ],
        max_tokens=2048,
        temperature=0.0,
    )
    return resp.choices[0].message.content.strip()
