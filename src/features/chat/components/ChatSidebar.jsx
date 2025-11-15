import { useState, useRef, useEffect } from 'react'
import { useChatStore } from '../state/chatStore'
import { useSessionStore } from '../../../shared/state/sessionStore'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import './ChatSidebar.css'

function ChatSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const messagesEndRef = useRef(null)
  
  const messages = useChatStore((state) => state.messages)
  const isStreaming = useChatStore((state) => state.isStreaming)
  const isLoading = useChatStore((state) => state.isLoading)
  const clearMessages = useChatStore((state) => state.clearMessages)
  const newConversation = useSessionStore((state) => state.newConversation)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleNewConversation = () => {
    if (window.confirm('Start a new conversation? Current chat will be cleared.')) {
      clearMessages()
      newConversation()
    }
  }

  if (isCollapsed) {
    return (
      <div className="chat-sidebar chat-sidebar-collapsed">
        <button
          className="chat-toggle"
          onClick={() => setIsCollapsed(false)}
          aria-label="Expand chat"
        >
          💬
        </button>
      </div>
    )
  }

  return (
    <aside className="chat-sidebar">
      <div className="chat-header">
        <div className="chat-header-title">
          <div className="chat-title-section">
            <h3> AI Financial Analyst</h3>
            <button
              className="new-chat-btn"
              onClick={handleNewConversation}
              disabled={isStreaming || isLoading}
              aria-label="New conversation"
            >
              + New
            </button>
          </div>
          <button
            className="chat-toggle"
            onClick={() => setIsCollapsed(true)}
            aria-label="Collapse chat"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <p>👋 Hello! I'm your AI financial analyst.</p>
            <p>Ask me about stocks, market analysis, or financial data.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={`${message.id}-${index}`} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput />
    </aside>
  )
}

export default ChatSidebar

