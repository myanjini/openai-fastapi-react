// 하나의 메시지와 작성 시각을 표시합니다.
function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const senderName = isUser ? '사용자' : 'AI';

  return (
    <div className={`message-row ${isUser ? 'user' : 'assistant'}`}>
      <article className="message-bubble">
        <strong className="message-sender">{senderName}</strong>
        <p className="message-content">{message.content}</p>

        {/* App에서 전달된 정적 작성 시각을 표시합니다. */}
        <time className="message-time">{message.time}</time>
      </article>
    </div>
  );
}

export default MessageBubble;