// 메시지 하나를 표시하는 자식 컴포넌트를 가져옵니다.
import MessageBubble from './MessageBubble';

// 여러 메시지를 순서대로 표시하는 대화 로그 컴포넌트입니다.
function MessageList({ messages }) {
  return (
    <section className="message-list" aria-label="대화 내용">
      {/*
        messages 배열을 map()으로 순회합니다.
        각 메시지 객체마다 MessageBubble 컴포넌트 하나를 생성합니다.
      */}
      {
        messages.map(message => <MessageBubble key={message.id} message={message} />)
      }
    </section>
  );
}

export default MessageList;