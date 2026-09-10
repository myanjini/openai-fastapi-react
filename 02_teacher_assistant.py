import os

from dotenv import load_dotenv
from openai import OpenAI

# 1) 프로젝트 루트의 .env 파일에서 API 설정을 로드합니다.
load_dotenv(override=True)
api_key = os.getenv("OPENAI_API_KEY")

# 2) API Key가 없으면 원인을 알 수 있도록 실행을 중단합니다.
if not api_key:
    raise ValueError(".env 파일에 OPENAI_API_KEY가 설정되어 있지 않습니다.")

# 3) OpenAI API 요청을 처리할 클라이언트를 생성합니다.
client = OpenAI(api_key=api_key)

# 4) AI 조교의 역할, 목표, 제약조건, 출력 형식을 한 곳에서 정의합니다.
instructions = """
역할: 당신은 직업훈련 학습자의 프로그래밍 학습을 지원하는 AI 조교입니다.
목표: 질문에 필요한 핵심 개념을 정확하고 이해하기 쉽게 설명합니다.
제약조건:
- 답변은 8문장 이내로 작성합니다.
- 학습자의 질문과 직접 관련 없는 내용은 생략합니다.
- 확실하지 않은 내용은 임의로 단정하지 않고 추가 정보가 필요하다고 안내합니다.
출력 형식:
1. 개념 설명
2. 짧은 예시
3. 확인 질문 1개
"""

# 5) 직전 Response ID를 저장합니다.
#    None이면 아직 연결할 이전 대화가 없다는 의미입니다.
previous_response_id = None

print("안내: AI 조교를 시작합니다. 새 대화는 new, 종료는 exit 또는 quit를 입력하세요.")

# 6) 종료 명령을 입력할 때까지 대화를 반복합니다.
while True:
    question = input("사용자: ").strip()

    # 7) 프로그램 종료 명령을 처리합니다.
    if question.lower() in {"exit", "quit"}:
        print("안내: AI 조교를 종료합니다.")
        break

    # 8) new를 입력하면 이전 Response 연결을 해제하여 새 대화로 시작합니다.
    if question.lower() == "new":
        previous_response_id = None
        print("안내: 새로운 대화를 시작합니다.")
        continue

    # 9) 빈 문자열은 API에 보내지 않습니다.
    if not question:
        print("안내: 질문을 입력해 주세요.")
        continue

    # 10) 모든 대화 턴에서 공통으로 사용할 요청 데이터를 구성합니다.
    request_data = {"model": "gpt-5.6", "instructions": instructions, "input": question}

    # 11) 이전 대화가 있으면 해당 Response ID를 현재 요청에 연결합니다.
    if previous_response_id is not None:
        request_data["previous_response_id"] = previous_response_id

    # 12) Responses API를 호출합니다.
    response = client.responses.create(**request_data)

    # 13) 생성된 답변을 출력합니다.
    print("AI: " + response.output_text)

    # 14) 현재 응답 ID를 저장하여 다음 질문의 대화 맥락으로 사용합니다.
    previous_response_id = response.id
