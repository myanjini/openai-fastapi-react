import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

function MessageList({ messages, isLoading }) {
  // 대화 목록의 마지막 위치를 참조합니다.
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    // 메시지가 추가될 때 마지막 위치로 스크롤합니다.
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <section className="message-list" aria-label="대화 내용" aria-live="polite">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
        />
      ))}

      {/* 서버 응답을 기다리는 동안 임시 로딩 상태를 표시합니다. */}
      {isLoading && (
        <div className="message-row assistant">
          <div className="message-bubble loading-bubble">
            <strong className="message-sender">AI</strong>
            <p className="message-content">
              답변을 생성하고 있습니다...
            </p>
          </div>
        </div>
      )}

      <div ref={endOfMessagesRef} />
    </section>
  );
}

export default MessageList;