// 브라우저에서 HTTP 요청을 보내기 위해 Axios를 가져옵니다.
import axios from 'axios';

// FastAPI 백엔드의 기본 주소입니다.
// 현재 실습에서는 FastAPI를 127.0.0.1:8000에서 실행합니다.
const API_BASE_URL = 'http://127.0.0.1:8000';

// 사용자의 질문을 FastAPI /chat 엔드포인트에 전송하는 함수입니다.
export async function sendChatMessage(message) {
  // axios.post()의 두 번째 인수는 JSON Request Body가 됩니다.
  // FastAPI의 ChatRequest 모델이 message 필드를 검증합니다.
  const response = await axios.post(
    `${API_BASE_URL}/chat`,
    {
      message: message
    },
    {
      // 교육용 실습에서 무한정 대기하지 않도록 최대 대기 시간을 지정합니다.
      timeout: 60000
    }
  );

  // FastAPI의 ChatResponse는 {"answer": "..."} 구조입니다.
  // UI 컴포넌트에서는 전체 Axios 응답이 아니라 답변 문자열만 사용하도록 반환합니다.
  return response.data.answer;
}


// fetch의 ReadableStream을 사용해 /chat/stream 응답을 청크 단위로 읽습니다.
export async function sendChatStreamMessage(message, onChunkReceived) {
  const response = await fetch(`${API_BASE_URL}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    },
    body: JSON.stringify({ message })
  });


  // HTTP 오류 응답은 본문 스트리밍을 시작하기 전에 예외로 변환합니다.
  if (!response.ok) {
    let detail = `HTTP${response.status}`;

    try {
      const errorBody = await response.json();
      detail = errorBody.detail ?? detail;
    } catch {
      // JSON 오류 본문이 아니면 HTTP 상태 코드 메시지를 그대로 사용합니다.
    }

    throw new Error(detail);
  }


  // ReadableStream을 제공하지 않는 브라우저 환경은 명시적으로 오류 처리합니다.
  if (!response.body) {
    throw new Error('브라우저에서 스트리밍 응답 본문을 읽을 수 없습니다.');
  }

  // 바이트 스트림을 직접 읽고 UTF-8 텍스트로 안전하게 복원합니다.
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');


  try {
    while (true) {
      // 서버에서 다음 청크가 도착할 때마다 즉시 읽습니다.
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      // 한글 문자가 청크 경계에서 나뉘어도 깨지지 않도록 연속 디코딩합니다.
      const chunkText = decoder.decode(value, { stream: true });

      if (chunkText) {
        onChunkReceived(chunkText);
      }
    }

    // 디코더 내부에 남은 마지막 바이트까지 비운 뒤 전달합니다.
    const lastChunk = decoder.decode();
    if (lastChunk) {
      onChunkReceived(lastChunk);
    }
  } finally {
    reader.releaseLock();
  }
}