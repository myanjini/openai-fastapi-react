import { useState } from 'react';

// 부모에서 메시지 전송 함수와 로딩 상태를 전달받습니다.
function ChatInput({ onSendMessage, isLoading = false }) {
  // 입력창의 현재 값을 State로 관리합니다.
  const [question, setQuestion] = useState('');

  const handleChange = (event) => {
    // 사용자가 입력한 최신 문자열을 State에 저장합니다.
    setQuestion(event.target.value);
  };

  const handleSubmit = (event) => {
    // form의 기본 페이지 새로고침을 막습니다.
    event.preventDefault();

    const trimmedQuestion = question.trim();

    // 빈 입력이거나 이미 답변을 기다리는 중이면 전송하지 않습니다.
    if (!trimmedQuestion || isLoading) {
      return;
    }

    // 부모 App에 질문을 전달합니다.
    onSendMessage(trimmedQuestion);

    // 정상 전송 후 입력창을 비웁니다.
    setQuestion('');
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="message-input">
        메시지 입력
      </label>

      <input
        id="message-input"
        name="message"
        type="text"
        placeholder={
          isLoading
            ? 'AI 답변을 기다리는 중입니다.'
            : '메시지를 입력하세요.'
        }
        autoComplete="off"
        value={question}
        onChange={handleChange}
        // 답변 대기 중에는 추가 입력도 잠시 막습니다.
        disabled={isLoading}
      />

      <button
        type="submit"
        // 입력이 없거나 답변 대기 중이면 전송 버튼을 비활성화합니다.
        disabled={!question.trim() || isLoading}
      >
        {/* 로딩 상태에 따라 버튼의 표시 문구를 변경합니다. */}
        {isLoading ? '답변 대기 중...' : '전송'}
      </button>
    </form>
  );
}

export default ChatInput;