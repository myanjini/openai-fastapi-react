import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

function MessageList({ messages }) {
  // 대화 목록의 마지막 위치를 참조합니다.
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    // 메시지가 추가될 때 마지막 위치로 스크롤합니다.
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <section className="message-list" aria-label="대화 내용">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
        />
      ))}

      <div ref={endOfMessagesRef} />
    </section>
  );
}

export default MessageList;