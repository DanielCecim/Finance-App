import { useRef } from 'react'
import { useChatStore } from '../state/chatStore'
import { useSessionStore } from '../../../shared/state/sessionStore'
import { postChat } from '../../../shared/utils/api'

/**
 * Hook for sending messages to the agent
 */
export function useSendMessage() {
  const eventSourceRef = useRef(null)
  
  const addUserMessage = useChatStore((state) => state.addUserMessage)
  const addAssistantMessage = useChatStore((state) => state.addAssistantMessage)
  const startStreaming = useChatStore((state) => state.startStreaming)
  const appendToken = useChatStore((state) => state.appendToken)
  const endStreaming = useChatStore((state) => state.endStreaming)
  const messages = useChatStore((state) => state.messages)
  
  const getIds = useSessionStore((state) => state.getIds)

  const sendMessage = async (content) => {
    try {
      // Add user message
      addUserMessage(content)

      const { sessionId, conversationId } = getIds()

      // Prepare messages payload
      const messagesPayload = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content },
      ]

      // Use non-streaming for simplicity (can switch to streaming)
      const response = await postChat({
        sessionId,
        conversationId,
        messages: messagesPayload,
        metadata: { ui_version: '1.0.0' },
      })

      // Add assistant response
      addAssistantMessage(response.content)
    } catch (error) {
      console.error('Error sending message:', error)
      addAssistantMessage(
        `Sorry, I encountered an error: ${error.message}. Please try again.`
      )
      endStreaming()
    }
  }

  const cancelStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    endStreaming()
  }

  return {
    sendMessage,
    cancelStream,
  }
}

