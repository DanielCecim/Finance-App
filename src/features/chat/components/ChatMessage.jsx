import './ChatMessage.css'

function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`chat-message ${isUser ? 'chat-message-user' : 'chat-message-assistant'}`}>
      <div className="chat-message-icon">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className="chat-message-content">
        <div className="chat-message-text">
          {message.content}
        </div>
        {message.timestamp && (
          <div className="chat-message-timestamp">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage

