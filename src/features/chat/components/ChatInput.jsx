import { useState, useRef, useEffect } from 'react'
import { useChatStore } from '../state/chatStore'
import { useSendMessage } from '../hooks/useSendMessage'
import Button from '../../../shared/components/Button'
import './ChatInput.css'

function ChatInput() {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)
  
  const isStreaming = useChatStore((state) => state.isStreaming)
  const { sendMessage, cancelStream } = useSendMessage()

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!input.trim() || isStreaming) return

    const message = input.trim()
    setInput('')
    
    await sendMessage(message)
  }

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleCancel = () => {
    cancelStream()
  }

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <div className="chat-input-wrapper">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me about stocks, analysis, or financial data..."
          disabled={isStreaming}
          rows={1}
          className="chat-input-textarea"
        />
        {isStreaming ? (
          <Button
            type="button"
            variant="danger"
            size="small"
            onClick={handleCancel}
          >
            Stop
          </Button>
        ) : (
          <Button
            type="submit"
            variant="primary"
            size="small"
            disabled={!input.trim()}
          >
            Send
          </Button>
        )}
      </div>
      <div className="chat-input-hint">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  )
}

export default ChatInput

