// 입력창의 현재 값을 State로 관리하기 위해 useState를 가져옵니다.
import { useState } from 'react';

// 사용자가 질문을 입력하고 부모 App으로 전달하는 컴포넌트입니다.
function ChatInput({ onSendMessage }) {
  // question State에는 입력창에 현재 표시되는 문자열을 저장합니다.
  const [question, setQuestion] = useState('');

  // 사용자가 입력창의 값을 변경할 때마다 실행됩니다.
  const handleChange = (event) => {
    // 브라우저 input의 현재 값을 React State에 저장합니다.
    setQuestion(event.target.value);
  };

  // 폼이 전송될 때 실행됩니다.
  const handleSubmit = (event) => {
    // HTML form의 기본 페이지 새로고침 동작을 막습니다.
    event.preventDefault();

    // 앞뒤 공백을 제거한 문자열을 검사합니다.
    const trimmedQuestion = question.trim();

    // 아무 내용도 입력하지 않은 경우 전송하지 않습니다.
    if (!trimmedQuestion) {
      return;
    }

    // 부모 App이 전달한 콜백 함수에 질문 문자열을 전달합니다.
    onSendMessage(trimmedQuestion);

    // 정상적으로 전달한 뒤 입력창을 빈 문자열로 초기화합니다.
    setQuestion('');
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      {/* 화면에는 보이지 않지만 스크린 리더를 위한 입력창 레이블입니다. */}
      <label className="sr-only" htmlFor="message-input">
        메시지 입력
      </label>

      <input
        id="message-input"
        name="message"
        type="text"
        placeholder="메시지를 입력하세요."
        autoComplete="off"
        // State 값을 input의 value와 연결합니다.
        value={question}
        // 키 입력으로 값이 바뀔 때 State를 갱신합니다.
        onChange={handleChange}
      />

      {/* 공백만 입력된 상태에서는 버튼을 비활성화합니다. */}
      <button type="submit" disabled={!question.trim()}>
        전송
      </button>
    </form>
  );
}

export default ChatInput;