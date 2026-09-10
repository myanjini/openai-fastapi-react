// 메시지 목록을 State로 관리하기 위해 useState Hook을 가져옵니다.
import { useState } from 'react';

// 챗봇 화면의 주요 스타일을 가져옵니다.
import './App.css';

// 화면을 구성하는 자식 컴포넌트를 가져옵니다.
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

// 애플리케이션이 처음 표시될 때 사용할 초기 메시지입니다.
const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content: '안녕하세요. AI 학습 도우미입니다. 무엇을 도와드릴까요?'
  }
];

function App() {
  // 전체 대화 메시지를 배열 State로 관리합니다.
  const [messages, setMessages] = useState(initialMessages);

  // ChatInput에서 사용자가 전송한 질문을 전달받습니다.
  const handleSendMessage = (question) => {
    // 사용자 메시지 객체를 생성합니다.
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: question
    };

    // 최신 메시지 배열 뒤에 사용자 메시지를 추가합니다.
    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage
    ]);

    // 실제 API 통신 전 단계이므로 500ms 후 로컬 임시 답변을 추가합니다.
    setTimeout(() => {
      // OpenAI API 결과가 아닌 학습용 임시 AI 메시지입니다.
      const assistantMessage = {
        id: Date.now(),
        role: 'assistant',
        content: `임시 답변입니다. 입력한 질문은 "${question}"입니다.`
      };

      // 가장 최신 messages State를 기준으로 AI 메시지를 추가합니다.
      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage
      ]);
    }, 500);
  };

  return (
    // 브라우저 전체 배경과 중앙 정렬을 담당하는 영역입니다.
    <div className="app-shell">
      {/* 실제 챗봇 인터페이스를 하나의 카드 형태로 구성합니다. */}
      <main className="chat-card">
        <ChatHeader
          title="AI 학습 도우미"
          subtitle="OpenAI API + FastAPI + React"
        />

        {/* State가 변경될 때 최신 messages Props가 전달됩니다. */}
        <MessageList messages={messages} />

        {/* 사용자가 질문을 보내면 handleSendMessage가 실행됩니다. */}
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
}

export default App;