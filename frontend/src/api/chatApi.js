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