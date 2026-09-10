// 서비스 제목, 설명, 현재 UI 상태를 표시합니다.
function ChatHeader({ title, subtitle, status }) {
  return (
    <header className="chat-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>

      {/* 콜론 뒤에 한 칸을 두고 상태 값을 표시합니다. */}
      <p className="chat-status">상태: {status}</p>
    </header>
  );
}

export default ChatHeader;