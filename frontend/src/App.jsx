// 메시지 배열과 요청 상태를 React State로 관리하기 위해 useState를 가져옵니다.
import { useState } from 'react';

// FastAPI /chat 호출 로직을 별도 모듈에서 가져옵니다.
import { sendChatMessage, sendChatStreamMessage  } from './api/chatApi';

import './App.css';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

// 애플리케이션 최초 표시 시 사용할 초기 안내 메시지입니다.
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

  // 현재 FastAPI 응답을 기다리고 있는지 관리합니다.
  const [isLoading, setIsLoading] = useState(false);

  const handleSendStreamMessage = async (question) => {
    if (isLoading) {
      return;
    }

    const userMessageId = Date.now();
    const assistantMessageId = userMessageId + 1;

    // 빈 AI 메시지를 먼저 추가해 이후 도착하는 청크를 같은 말풍선에 누적합니다.
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        id: userMessageId,
        role: 'user',
        content: question
      },
      {
        id: assistantMessageId,
        role: 'assistant',
        content: ''
      }
    ]);

    setIsLoading(true);

    try {
      await sendChatStreamMessage(question, (chunkText) => {
        // 새 청크가 도착할 때마다 기존 AI 메시지의 content 뒤에 즉시 이어 붙입니다.
        setMessages(previousMessages => 
          previousMessages.map(message => 
            message.id === assistantMessageId ?
              { ...message, content: message.content + chunkText }
              : message
          )
        );
      });
    } catch (error) {
      // 스트리밍 오류에서도 이미 받은 답변 보존
      console.error("챗봇 스트리밍 요청 오류:", error);

      setMessages(previousMessages =>
        previousMessages.map(message => 
          message.id === assistantMessageId ?
            {...message, content: message.content || "서버와 통신하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."}
            : message
        )
      );      
    } finally {
      setIsLoading(false);
    }
  };

  // ChatInput에서 사용자가 전송한 질문을 전달받아 실제 API를 호출합니다.
  const handleSendMessage = async (question) => {
    // 이미 요청을 처리 중이면 중복 요청을 시작하지 않습니다.
    if (isLoading) {
      return;
    }

    // 사용자 질문을 화면에 표시할 메시지 객체로 만듭니다.
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: question
    };

    // 사용자 메시지는 네트워크 응답을 기다리기 전에 즉시 추가합니다.
    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage
    ]);

    // API 요청 시작 상태를 화면에 반영합니다.
    setIsLoading(true);

    try {
      // Axios를 이용하는 별도 API 함수가 FastAPI /chat을 호출합니다.
      const answer = await sendChatMessage(question);

      // FastAPI가 반환한 answer 문자열을 AI 메시지로 만듭니다.
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: answer
      };

      // 기존 대화 뒤에 실제 AI 답변을 추가합니다.
      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage
      ]);
    } catch (error) {
      // 개발자가 상세 원인을 확인할 수 있도록 브라우저 Console에 출력합니다.
      console.error('챗봇 요청 오류: ', error);

      // 사용자에게는 내부 예외 상세 대신 이해하기 쉬운 공통 메시지를 보여 줍니다.
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '서버와 통신하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        errorMessage
      ]);
    } finally {
      // 성공·실패 여부와 관계없이 요청이 끝났으므로 로딩 상태를 해제합니다.
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <main className="chat-card">
        <ChatHeader
          title="AI 학습 도우미"
          subtitle="OpenAI API + FastAPI + React"
        />

        {/* 최신 메시지와 API 요청 상태를 함께 전달합니다. */}
        <MessageList
          messages={messages}
          isLoading={isLoading}
        />

        {/* 요청 중에는 입력과 중복 전송을 제한합니다. */}
        <ChatInput
          onSendMessage={handleSendStreamMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default App;