import sys
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

load_dotenv()

def main():
    input_text = sys.stdin.read().strip()
    if not input_text:
        print("요약할 정책 정보가 없습니다.", flush=True)
        return

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY가 설정되지 않았습니다.", flush=True)
        sys.exit(1)

    llm = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.2,
        openai_api_key=api_key,
    )

    prompt = f"""
다음은 청년 정책 원문 정보이다.

이를 바탕으로 사용자가 한눈에 이해할 수 있도록
아래 형식으로 요약하라.

- 정책 요약 (3줄 이내)
- 이런 사람에게 추천
- 핵심 포인트 3가지
- 주의할 점 (있다면)

정책 원문:
{input_text}
""".strip()

    try:
        result = llm.invoke([HumanMessage(content=prompt)])
        print(result.content.strip(), flush=True)
    except Exception as e:
        print(f"요약 생성 오류: {e}", flush=True)
        sys.exit(1)

if __name__ == "__main__":
    main()
