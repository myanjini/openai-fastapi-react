import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

// 기존 챗봇 질문 전송 함수입니다.
export async function sendChatMessage(message) {
  const response = await axios.post(
    `${API_BASE_URL}/chat`,
    {
      message: message
    },
    {
      timeout: 60000
    }
  );

  return response.data.answer;
}

// FastAPI 서버가 정상 동작하는지 /health로 확인합니다.
export async function checkBackendHealth() {
  const response = await axios.get(
    `${API_BASE_URL}/health`,
    {
      timeout: 5000
    }
  );

  // 3차시 /health 응답의 status 값을 반환합니다.
  return response.data.status;
}