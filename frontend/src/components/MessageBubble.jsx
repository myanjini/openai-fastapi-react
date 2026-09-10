// 하나의 사용자 또는 AI 메시지를 말풍선 형태로 표시하는 컴포넌트입니다.
function MessageBubble({ message }) {
  // role이 user이면 사용자 메시지로 판단합니다.
  const isUser = message.role === 'user';

  // 사용자와 AI 메시지에 표시할 이름을 결정합니다.
  const senderName = isUser ? '사용자' : 'AI';

  return (
    // role에 따라 user 또는 assistant CSS 클래스를 추가합니다.
    <div className={`message-row ${isUser ? 'user' : 'assistant'}`}>
      <article className="message-bubble">
        {/* 메시지를 보낸 주체를 표시합니다. */}
        <strong className="message-sender">{senderName}</strong>

        {/* 실제 메시지 본문을 표시합니다. */}
        <p className="message-content">{message.content}</p>
      </article>
    </div>
  );
}

export default MessageBubble;