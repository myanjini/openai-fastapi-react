// 챗봇 화면의 주요 스타일을 가져옵니다.
import './App.css';

// 화면을 구성하는 자식 컴포넌트를 가져옵니다.
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

// 5차시에서는 State 대신 고정된 예제 메시지 배열을 사용합니다.
// 6차시에서 이 배열을 useState로 관리하도록 변경할 예정입니다.
const sampleMessages = [
  {
    id: 1,
    role: 'assistant',
    content: '안녕하세요. AI 학습 도우미입니다. 무엇을 도와드릴까요?'
  },
  {
    id: 2,
    role: 'user',
    content: 'React 컴포넌트는 어떤 역할을 하나요?'
  },
  {
    id: 3,
    role: 'assistant',
    content: 'React 컴포넌트는 화면의 일부를 독립적인 단위로 구성하고 재사용할 수 있게 합니다.'
  },
  {
    id: 4,
    role: 'user',
    content: '메시지 목록은 어떤 방식으로 표시하나요?'
  },
  {
    id: 5,
    role: 'assistant',
    content: '메시지 배열을 map()으로 순회해 각 항목을 MessageBubble 컴포넌트로 렌더링할 수 있습니다.'
  }, 
  {
    id: 6,
    role: 'user',
    content: '스크롤 영역도 확인해 보고 싶습니다.'
  },
  {
    id: 7,
    role: 'assistant',
    content: '메시지가 많아지면 가운데 MessageList 영역에 세로 스크롤이 나타납니다.'
  },
  {
    id: 8,
    role: 'user',
    content: '헤더와 입력창은 그대로 유지되나요?'
  },
  {
    id: 9,
    role: 'assistant',
    content: '네. 메시지 목록만 flex: 1과 overflow-y: auto를 사용하므로 해당 영역만 스크롤됩니다.'
  }
];

function App() {
  return (
    // 브라우저 전체 배경과 중앙 정렬을 담당하는 영역입니다.
    <div className="app-shell">
      {/* 실제 챗봇 인터페이스를 하나의 카드 형태로 구성합니다. */}
      <main className="chat-card">
        <ChatHeader
          title="AI 학습 도우미"
          subtitle="OpenAI API + FastAPI + React"
        />

        {/* 정적 예제 메시지를 MessageList에 Props로 전달합니다. */}
        <MessageList messages={sampleMessages} />

        {/* 현재 차시에서는 UI만 제공하고 실제 전송은 6차시에 구현합니다. */}
        <ChatInput />
      </main>
    </div>
  );
}

export default App;