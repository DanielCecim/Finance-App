import { renderMarkdown } from '../../../shared/utils/markdownRenderer'
import './ChatMessage.css'

function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  const isLoading = message.isLoading

  return (
    <div className={`chat-message ${isUser ? 'chat-message-user' : 'chat-message-assistant'}`}>
      <div className="chat-message-icon">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className="chat-message-content">
        <div className="chat-message-text">
          {isLoading ? (
            <div className="chat-loading">
              <div className="chat-loading-spinner"></div>
              <span>Thinking...</span>
            </div>
          ) : isUser ? (
            message.content
          ) : (
            renderMarkdown(message.content)
          )}
        </div>
        {message.timestamp && !isLoading && (
          <div className="chat-message-timestamp">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage

