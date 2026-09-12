import asyncio
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI
from pydantic import BaseModel, Field

# 여러 데이터 조각을 순차적으로 전송하는 응답 클래스를 가져옵니다.
from fastapi.responses import StreamingResponse

# ---------------------------------------------------------
# 1. 프로젝트 설정과 .env 로드
# ---------------------------------------------------------

# main.py의 위치를 기준으로 프로젝트 루트 경로를 계산합니다.
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# 프로젝트 루트의 .env 파일 경로입니다.
ENV_PATH = PROJECT_ROOT / ".env"

# .env의 값을 현재 Python 프로세스에 로드합니다.
load_dotenv(dotenv_path=ENV_PATH, override=True)

# .env에서 OpenAI API Key를 가져옵니다.
api_key = os.getenv("OPENAI_API_KEY")

# API Key가 없으면 서버 시작 단계에서 즉시 오류를 발생시킵니다.
if not api_key:
    raise ValueError(".env 파일에 OPENAI_API_KEY가 설정되어 있지 않습니다.")


# ---------------------------------------------------------
# 2. 외부 서비스 클라이언트와 공통 지침
# ---------------------------------------------------------

# OpenAI API를 비동기로 호출하기 위한 클라이언트를 생성합니다.
client = AsyncOpenAI(api_key=api_key)

# 모든 챗봇 요청에 공통으로 적용할 서비스 지침입니다.
CHATBOT_INSTRUCTIONS = """
당신은 직업훈련 학습자의 프로그래밍 질문을 돕는 AI 조교입니다.
답변은 정확하고 간결하게 작성합니다.
코드가 필요하면 핵심 예제만 제공합니다.
확실하지 않은 내용은 추측하지 않습니다.
""".strip()


# ---------------------------------------------------------
# 3. FastAPI 애플리케이션과 CORS
# ---------------------------------------------------------

# FastAPI 애플리케이션 객체를 생성합니다.
app = FastAPI(title="OpenAI Chatbot API", version="0.2.0")

# Vite 기반 React 개발 서버의 Origin을 명시적으로 허용합니다.
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# React와 FastAPI가 서로 다른 Origin에서 통신할 수 있도록 CORS를 설정합니다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# 4. Pydantic 요청·응답 모델
# ---------------------------------------------------------


# POST /chat에서 받을 Request Body의 구조입니다.
class ChatRequest(BaseModel):
    # 사용자 질문은 1자 이상 1000자 이하의 문자열만 허용합니다.
    message: str = Field(
        min_length=1, max_length=1000, description="사용자가 챗봇에 전달하는 질문"
    )


# POST /chat이 반환할 Response Body의 구조입니다.
class ChatResponse(BaseModel):
    # OpenAI API가 생성한 최종 답변 텍스트입니다.
    answer: str


# ---------------------------------------------------------
# 5. 3차시에서 만든 기본 API
# ---------------------------------------------------------


# GET / 요청으로 API 서버의 기본 정보를 반환합니다.
@app.get("/")
async def root():
    return {"message": "FastAPI 서버가 실행 중입니다."}


# GET /health 요청으로 서버 상태를 확인합니다.
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "서버가 정상 동작 중입니다."}


# Path Parameter와 Query Parameter 예제입니다.
@app.get("/hello/{name}")
async def hello(name: str, level: str = "beginner"):
    return {"message": f"{name}님, 안녕하세요.", "level": level}


# async def와 await 동작을 확인하는 교육용 API입니다.
@app.get("/wait")
async def wait_demo(seconds: int = 1):
    # 실제 스레드를 멈추지 않고 비동기 방식으로 지정 시간만큼 기다립니다.
    await asyncio.sleep(seconds)

    return {"message": "비동기 대기가 완료되었습니다.", "seconds": seconds}


# ---------------------------------------------------------
# 6. 4차시에서 추가한 요청 검증 API
# ---------------------------------------------------------


# OpenAI API 호출 없이 Pydantic Request Body 검증만 확인합니다.
@app.post("/chat/validate")
async def validate_chat(request: ChatRequest):
    return {"message": request.message, "length": len(request.message)}


# ---------------------------------------------------------
# 7. 4차시의 최종 챗봇 API
# ---------------------------------------------------------


# 사용자의 질문을 받아 OpenAI API를 호출하고 AI 답변을 반환합니다.
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # OpenAI Responses API를 비동기로 호출합니다.
        # 서비스 공통 규칙은 instructions에, 사용자 질문은 input에 전달합니다.
        response = await client.responses.create(
            model="gpt-5.6", instructions=CHATBOT_INSTRUCTIONS, input=request.message
        )
    except Exception as exc:
        # 개발자가 확인할 실제 오류는 서버 명령 프롬프트에 기록합니다.
        print(f"OpenAI API 오류:{exc}")

        # 클라이언트에는 내부 상세 오류를 노출하지 않고 일반화한 메시지를 반환합니다.
        raise HTTPException(
            status_code=500, detail="AI 응답 생성 중 오류가 발생했습니다."
        ) from exc

    # OpenAI SDK의 output_text에서 최종 생성 텍스트를 가져와 응답합니다.
    return ChatResponse(answer=response.output_text)


# HTTP 스트리밍을 눈으로 확인하기 위한 교육용 비동기 제너레이터입니다.
async def generate_stream_demo():
    # 실제 모델 응답 대신 미리 준비한 문자열 조각을 순차적으로 생성합니다.
    chunks = [
        "첫 번째 데이터 조각입니다.\n",
        "두 번째 데이터 조각입니다.\n",
        "세 번째 데이터 조각입니다.\n",
    ]

    for chunk in chunks:
        # yield를 이용해 현재 조각을 즉시 StreamingResponse에 전달합니다.
        yield chunk

        # 다음 조각이 전송되기 전에 0.7초 동안 비동기로 기다립니다.
        await asyncio.sleep(0.7)


# 일반 JSON 응답이 아니라 문자열 조각을 순차적으로 전송합니다.
@app.get("/stream-demo")
async def stream_demo():
    return StreamingResponse(generate_stream_demo(), media_type="text/plain")


# OpenAI Responses API의 텍스트 delta를 HTTP 스트림으로 전달합니다.
async def generate_chat_stream(message: str):
    try:
        # stream=True로 최종 응답을 기다리지 않고 생성 이벤트를 순차 수신합니다.
        stream = await client.responses.create(
            model="gpt-5.6",
            instructions=CHATBOT_INSTRUCTIONS,
            input=message,
            stream=True,
        )

        async for event in stream:
            # 텍스트 생성 이벤트만 골라 delta를 즉시 클라이언트로 전달합니다.
            if event.type == "response.output_text.delta":
                delta_text = event.delta

                if delta_text:
                    yield delta_text

    except asyncio.CancelledError:
        # 클라이언트 연결이 끊기면 스트리밍 작업도 중단합니다.
        raise
    except Exception as exc:
        # 스트리밍 시작 후에는 JSON 오류 응답으로 전환할 수 없어 텍스트로 오류를 전달합니다.
        print(f"OpenAI 스트리밍 API 오류:{exc}")
        yield "\n\n[AI 응답을 스트리밍하는 중 오류가 발생했습니다.]"



from fastapi.responses import StreamingResponse

@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    # 중간 캐시와 버퍼링을 막아 생성된 텍스트가 가능한 즉시 브라우저에 도착하도록 합니다.
    return StreamingResponse(
        generate_chat_stream(request.message),
        media_type="text/plain; charset=utf-8",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
        },
    )