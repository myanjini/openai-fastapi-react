import os

from dotenv import load_dotenv
from openai import OpenAI

# 1) 프로젝트 루트의 .env 파일에서 환경값을 로드합니다.
load_dotenv(override=True)

# 2) .env에서 OpenAI API Key를 읽습니다.
api_key = os.getenv("OPENAI_API_KEY")

# 3) API Key가 없으면 인증 오류가 발생하기 전에 설정 문제를 알려 줍니다.
if not api_key:
    raise ValueError(".env 파일에 OPENAI_API_KEY가 설정되어 있지 않습니다.")

# 4) OpenAI API 요청을 담당할 클라이언트를 생성합니다.
client = OpenAI(api_key=api_key)

# 5) 사용자 질문과 분리하여 챗봇의 역할과 답변 규칙을 정의합니다.
instructions = """
역할: 당신은 Python 입문자를 지도하는 AI 강사입니다.
대상: Python 기본 문법을 학습한 초급 학습자입니다.
제약조건:
- 답변은 5문장 이내로 작성합니다.
- 전문용어를 사용하면 바로 쉬운 뜻을 덧붙입니다.
- 질문과 직접 관련 없는 내용은 생략합니다.
출력 형식:
1. 개념 설명
2. 짧은 예시
3. 확인 질문 1개
"""

# 6) 실행할 때마다 달라지는 실제 사용자 질문을 입력받습니다.
question = input("사용자 질문: ").strip()

# 7) 빈 문자열은 API로 보내지 않습니다.
if not question:
    print("안내: 질문을 입력해야 합니다.")
else:
    # 8) instructions에는 고정 규칙을, input에는 사용자의 실제 질문을 전달합니다.
    response = client.responses.create(
        model="gpt-5.6", instructions=instructions, input=question
    )

    # 9) Response 객체에서 생성된 텍스트를 가져와 출력합니다.
    print("\nAI 답변: " + response.output_text)
