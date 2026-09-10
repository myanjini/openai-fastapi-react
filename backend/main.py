import asyncio

from fastapi import FastAPI

# 1) 전체 API의 중심이 되는 FastAPI 애플리케이션 객체를 생성합니다.
#    title과 version은 Swagger UI와 OpenAPI 문서에 표시됩니다.
app = FastAPI(title="OpenAI Chatbot API", version="0.1.0")


# 2) GET / 요청을 처리하는 기본 라우트입니다.
@app.get("/")
async def root():
    # Python 딕셔너리를 반환하면 FastAPI가 JSON 응답으로 처리합니다.
    return {"message": "FastAPI 서버가 실행 중입니다."}


# 3) 서버가 HTTP 요청에 정상적으로 응답하는지 확인하는 라우트입니다.
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "서버가 정상 동작 중입니다."}


# 4) Path Parameter와 Query Parameter를 함께 사용하는 라우트입니다.
#    name: URL 경로의 {name}에서 전달받습니다.
#    level: ?level=advanced와 같은 Query String에서 전달받습니다.
@app.get("/hello/{name}")
async def hello(name: str, level: str = "beginner"):
    return {"message": f"{name}님, 안녕하세요.", "level": level}


# 5) 비동기 함수와 await의 기본 동작을 확인하는 교육용 라우트입니다.
@app.get("/wait")
async def wait_demo(seconds: int = 1):
    # 네트워크나 외부 API 호출처럼 기다림이 발생하는 상황을 단순화한 예제입니다.
    # asyncio.sleep()을 await하면 대기 중에 이벤트 루프가 다른 작업을 처리할 수 있습니다.
    await asyncio.sleep(seconds)

    return {"message": "비동기 대기가 완료되었습니다.", "seconds": seconds}


# 교육 차시 정보를 확인하는 추가 실습용 라우트입니다.
@app.get("/lesson/{lesson_no}")
async def lesson_info(lesson_no: int, topic: str = "FastAPI"):
    # lesson_no는 URL 경로에서 정수형 Path Parameter로 전달받습니다.
    # topic은 Query Parameter이며 전달하지 않으면 기본값 "FastAPI"를 사용합니다.
    return {
        "lesson_no": lesson_no,
        "topic": topic,
        "message": f"{lesson_no}차시 학습 주제는{topic}입니다.",
    }
