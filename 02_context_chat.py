import os

from dotenv import load_dotenv
from openai import OpenAI

# 1) 프로젝트 루트의 .env 파일에서 환경값을 로드합니다.
load_dotenv(override=True)

# 2) .env에서 OpenAI API Key를 읽습니다.
api_key = os.getenv("OPENAI_API_KEY")

# 3) API Key가 없으면 잘못된 상태로 요청하지 않도록 실행을 중단합니다.
if not api_key:
    raise ValueError(".env 파일에 OPENAI_API_KEY가 설정되어 있지 않습니다.")

# 4) OpenAI API 요청을 담당할 클라이언트를 생성합니다.
client = OpenAI(api_key=api_key)

# 5) 챗봇이 모든 대화에서 유지해야 할 페르소나와 제약조건을 정의합니다.
instructions = """
당신은 Python과 웹 개발을 학습하는 직업훈련 학습자를 돕는 AI 강사입니다.
- 답변은 이해하기 쉬운 한국어로 작성합니다.
- 핵심 개념을 먼저 설명한 뒤 짧은 예를 제공합니다.
- 답변은 7문장 이내로 작성합니다.
- 모르는 내용은 추측하지 않습니다.
"""

# 6) 첫 요청에는 이전 Response가 없으므로 None으로 시작합니다.
previous_response_id = None

# 7) 사용자가 종료 명령을 입력할 때까지 질문과 답변을 반복합니다.
while True:
    # 사용자 질문을 입력받고 앞뒤 공백을 제거합니다.
    question = input("사용자: ").strip()

    # exit 또는 quit를 입력하면 반복문을 종료합니다.
    if question.lower() in {"exit", "quit"}:
        print("안내: 대화를 종료합니다.")
        break

    # 빈 문자열은 API로 전송하지 않습니다.
    if not question:
        print("안내: 질문을 입력해 주세요.")
        continue

    # 8) 현재 요청에 공통으로 사용할 모델, 지침, 사용자 입력을 구성합니다.
    request_data = {
        "model": "gpt-5.6",
        "instructions": instructions,
        "input": question
    }

    # 9) 두 번째 요청부터는 이전 응답 ID를 추가해 대화 맥락을 연결합니다.
    #    첫 요청에서는 previous_response_id가 None이므로 이 항목을 보내지 않습니다.
    if previous_response_id is not None:
        request_data["previous_response_id"] = previous_response_id

    # 10) 구성한 요청 데이터를 Responses API에 전달합니다.
    response = client.responses.create(**request_data)

    # 11) 모델이 생성한 텍스트를 사용자에게 보여 줍니다.
    print("AI: " + response.output_text)

    # 12) 현재 Response의 ID를 저장하여 다음 턴의 맥락으로 사용합니다.
    previous_response_id = response.id