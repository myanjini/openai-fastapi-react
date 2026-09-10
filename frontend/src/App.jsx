// 메시지와 로딩 상태를 관리하기 위해 useState Hook을 가져옵니다.
import { useState } from 'react';

import './App.css';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

// 최초 화면에 표시할 안내 메시지입니다.
const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content: '안녕하세요. AI 학습 도우미입니다. 무엇을 도와드릴까요?'
  }
];

function App() {
  // 전체 대화 메시지를 State로 관리합니다.
  const [messages, setMessages] = useState(initialMessages);

  // 임시 AI 답변을 기다리는 상태인지 관리합니다.
  const [isLoading, setIsLoading] = useState(false);

  // 사용자가 질문을 전송하면 실행됩니다.
  const handleSendMessage = (question) => {
    // 중복 전송을 막기 위해 답변 대기 상태로 변경합니다.
    setIsLoading(true);

    // 사용자 질문을 메시지 객체로 구성합니다.
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: question
    };

    // 이전 메시지 뒤에 사용자 질문을 추가합니다.
    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage
    ]);

    // 실제 API 응답 시간을 흉내 내는 학습용 타이머입니다.
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now(),
        role: 'assistant',
        content: `임시 답변입니다. 입력한 질문은 "${question}"입니다.`
      };

      // 최신 메시지 배열 뒤에 임시 AI 답변을 추가합니다.
      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage
      ]);

      // 답변 추가가 끝났으므로 로딩 상태를 해제합니다.
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="app-shell">
      <main className="chat-card">
        <ChatHeader
          title="AI 학습 도우미"
          subtitle="OpenAI API + FastAPI + React"
        />

        <MessageList messages={messages} />

        {/* 답변 대기 상태도 입력 컴포넌트에 전달합니다. */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default App;