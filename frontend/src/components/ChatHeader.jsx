// 챗봇 화면 상단의 제목과 설명을 표시하는 컴포넌트입니다.
function ChatHeader({ title, subtitle }) {
  return (
    <header className="chat-header">
      {/* 부모 컴포넌트에서 전달받은 서비스 제목을 표시합니다. */}
      <h1>{title}</h1>

      {/* 서비스의 기술 구성 또는 간단한 안내 문구를 표시합니다. */}
      <p>{subtitle}</p>
    </header>
  );
}

// 다른 파일에서 ChatHeader를 import할 수 있도록 기본 내보내기를 설정합니다.
export default ChatHeader;