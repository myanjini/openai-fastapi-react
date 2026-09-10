import os

from dotenv import load_dotenv
from openai import OpenAI

# 1) 프로젝트 루트의 .env 파일을 읽습니다.
load_dotenv(override=True)

# 2) .env에 저장된 OpenAI API Key를 가져옵니다.
api_key = os.getenv("OPENAI_API_KEY")

# 3) API Key가 없으면 프로그램을 즉시 중단하여 설정 오류를 알려 줍니다.
if not api_key:
    raise ValueError(".env 파일에 OPENAI_API_KEY가 설정되어 있지 않습니다.")

# 4) OpenAI API를 호출할 클라이언트 객체를 생성합니다.
client = OpenAI(api_key=api_key)

# 5) 프로그램 사용 방법을 한 번 출력합니다.
print("AI 콘솔을 시작합니다.")
print("종료하려면 exit 또는 quit를 입력하세요.")

# 6) 사용자가 종료 명령을 입력할 때까지 질문 입력을 반복합니다.
while True:
    # 질문을 입력받고 앞뒤 공백을 제거합니다.
    question = input("\n질문: ").strip()

    # exit 또는 quit를 대소문자 구분 없이 확인하고 반복문을 종료합니다.
    if question.lower() in {"exit", "quit"}:
        print("프로그램을 종료합니다.")
        break

    # 빈 문자열이면 API를 호출하지 않고 다음 입력으로 넘어갑니다.
    if not question:
        print("질문을 입력해 주세요.")
        continue

    # 정상 질문을 Responses API에 전달합니다.
    # 이 차시에서는 이전 질문·답변을 함께 보내지 않으므로 각 요청은 독립적입니다.
    response = client.responses.create(model="gpt-5.6", input=question)

    # 생성된 답변 텍스트를 출력합니다.
    print("\nAI: ", end="")
    print(response.output_text)
