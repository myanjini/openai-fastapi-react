// 렌더링 이후 DOM과 동기화하기 위해 useEffect를 가져옵니다.
// 메시지 목록의 마지막 DOM 요소를 참조하기 위해 useRef를 가져옵니다.
import { useEffect, useRef } from 'react';

// 메시지 하나를 표시하는 컴포넌트를 가져옵니다.
import MessageBubble from './MessageBubble';

// 여러 메시지를 표시하고 새 메시지 추가 시 자동 스크롤하는 컴포넌트입니다.
function MessageList({ messages }) {
  // 메시지 목록 마지막 위치의 DOM 요소를 저장할 ref를 생성합니다.
  const endOfMessagesRef = useRef(null);

  // messages 배열이 변경된 렌더링 이후 실행됩니다.
  useEffect(() => {
    // 마지막 DOM 요소가 존재하면 부드럽게 화면 안으로 이동시킵니다.
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <section className="message-list" aria-label="대화 내용">
      {/* 최신 messages 배열을 순회해 메시지 버블을 생성합니다. */}
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
        />
      ))}

      {/* 자동 스크롤의 목표가 되는 메시지 목록 마지막 위치입니다. */}
      <div ref={endOfMessagesRef} />
    </section>
  );
}

export default MessageList;