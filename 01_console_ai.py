import os

from dotenv import load_dotenv
from openai import OpenAI

# .env 파일의 설정값을 읽습니다.
load_dotenv(override=True)

# OpenAI API Key를 읽고 설정 여부를 확인합니다.
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError(".env 파일에 OPENAI_API_KEY가 설정되어 있지 않습니다.")

# OpenAI API 클라이언트를 생성합니다.
client = OpenAI(api_key=api_key)

# input()으로 사용자 질문을 받고, strip()으로 앞뒤 공백을 제거합니다.
question = input("질문을 입력하세요: ").strip()

# 빈 문자열이면 불필요한 API 요청을 보내지 않습니다.
if not question:
    print("질문을 입력해야 합니다.")
else:
    # 사용자가 입력한 질문을 Responses API의 input으로 전달합니다.
    response = client.responses.create(
        model="gpt-5.6",
        input=question
    )

    # 답변 영역을 구분하여 생성 결과를 출력합니다.
    print("\nAI 답변")
    print("-" * 40)
    print(response.output_text)