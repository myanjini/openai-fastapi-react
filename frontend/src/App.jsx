// 챗봇 화면의 주요 스타일을 가져옵니다.
import './App.css';

// 화면을 구성하는 자식 컴포넌트를 가져옵니다.
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

// 정적 예제 메시지에 time 속성을 추가합니다.
const sampleMessages = [
  {
    id: 1,
    role: 'assistant',
    content: '안녕하세요. AI 학습 도우미입니다. 무엇을 도와드릴까요?',
    time: '10:00'
  },
  {
    id: 2,
    role: 'user',
    content: 'React 컴포넌트는 어떤 역할을 하나요?',
    time: '10:01'
  },
  {
    id: 3,
    role: 'assistant',
    content: 'React 컴포넌트는 화면의 일부를 독립적인 단위로 구성하고 재사용할 수 있게 합니다.',
    time: '10:01'
  }
];

function App() {
  return (
    <div className="app-shell">
      <main className="chat-card">
        <ChatHeader
          title="AI 학습 도우미"
          subtitle="OpenAI API + FastAPI + React"
          status="UI 개발 중"
        />

        <MessageList messages={sampleMessages} />
        <ChatInput />
      </main>
    </div>
  );
}

export default App;