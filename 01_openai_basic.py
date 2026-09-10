import os

from dotenv import load_dotenv
from openai import OpenAI

# 프로젝트 루트의 .env 파일을 읽어 현재 Python 프로세스에 값을 로드합니다.
load_dotenv(override=True)

# .env에서 OPENAI_API_KEY 값을 가져옵니다.
api_key = os.getenv("OPENAI_API_KEY")

# API Key가 누락된 상태로 요청을 보내지 않도록 사전에 확인합니다.
if not api_key:
    raise ValueError(".env 파일에 OPENAI_API_KEY가 설정되어 있지 않습니다.")

# .env에서 읽은 API Key로 OpenAI 클라이언트를 생성합니다.
client = OpenAI(api_key=api_key)

# 사용할 모델과 입력 문장을 지정하여 Responses API에 생성 요청을 보냅니다.
response = client.responses.create(
    model="gpt-5.6", input="생성형 AI를 한 문장으로 설명해 주세요."
)

# API 응답 객체에서 생성된 텍스트만 가져와 출력합니다.
print(response.output_text)
