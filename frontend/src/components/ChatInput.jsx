// 사용자가 질문을 입력할 폼과 전송 버튼을 표시하는 컴포넌트입니다.
function ChatInput() {
  // 5차시에서는 API 전송 로직을 구현하지 않습니다.
  // submit 시 브라우저 페이지가 새로고침되는 것만 막습니다.
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      {/* 화면에는 보이지 않지만 스크린 리더를 위한 입력창 레이블입니다. */}
      <label className="sr-only" htmlFor="message-input">
        메시지 입력
      </label>

      {/* 6차시에서 value와 onChange를 State에 연결합니다. */}
      <input
        id="message-input"
        name="message"
        type="text"
        placeholder="메시지를 입력하세요."
        autoComplete="off"
      />

      {/* 현재 차시에서는 눌러도 실제 API 요청을 보내지 않습니다. */}
      <button type="submit">전송</button>
    </form>
  );
}

export default ChatInput;