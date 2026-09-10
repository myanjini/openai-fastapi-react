import os

from dotenv import load_dotenv
from openai import OpenAI

# 1) .env 파일에서 API Key를 현재 Python 프로세스에 로드합니다.
load_dotenv(override=True)
api_key = os.getenv("OPENAI_API_KEY")

# 2) API Key가 누락되었는지 확인합니다.
if not api_key:
    raise ValueError(".env 파일에 OPENAI_API_KEY가 설정되어 있지 않습니다.")

# 3) OpenAI API를 호출할 클라이언트를 생성합니다.
client = OpenAI(api_key=api_key)

# 4) 이전 대화를 System → User → Assistant → User 순서로 구성합니다.
#    system: 챗봇이 따라야 할 상위 수준의 지침
#    user: 사용자의 질문
#    assistant: 이전 턴에서 모델이 생성했다고 가정하는 답변
messages = [
    {
        "role": "system",
        "content": "당신은 Python 학습자의 질문에 간결하게 답하는 강사입니다.",
    },
    {
        "role": "user",
        "content": "Python 리스트와 튜플의 가장 큰 차이를 한 문장으로 설명해 주세요.",
    },
    {
        "role": "assistant",
        "content": "리스트는 생성 후 내용을 변경할 수 있지만, 튜플은 생성 후 요소를 변경할 수 없습니다.",
    },
    {"role": "user", "content": "그 차이가 프로그램 설계에 어떤 영향을 주나요?"},
]

# 5) 역할별 메시지를 하나의 input 목록으로 전달합니다.
response = client.responses.create(model="gpt-5.6", input=messages)

# 6) 이전 대화 맥락을 반영한 새 응답을 출력합니다.
print("AI 답변: " + response.output_text)
