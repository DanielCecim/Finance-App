import { create } from 'zustand'

/**
 * Chat store for managing messages and streaming state
 */
const useChatStore = create((set, get) => ({
  messages: [],
  isStreaming: false,
  isLoading: false,
  currentStreamingMessage: null,

  // Add a user message
  addUserMessage: (content) => {
    const message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    set((state) => ({
      messages: [...state.messages, message],
    }))
    return message
  },

  // Add loading message
  addLoadingMessage: () => {
    const message = {
      id: `loading-${Date.now()}`,
      role: 'assistant',
      content: '',
      isLoading: true,
      timestamp: Date.now(),
    }
    set((state) => ({
      messages: [...state.messages, message],
      isLoading: true,
    }))
    return message.id
  },

  // Remove loading message
  removeLoadingMessage: () => {
    set((state) => ({
      messages: state.messages.filter((msg) => !msg.isLoading),
      isLoading: false,
    }))
  },

  // Start streaming an assistant message
  startStreaming: () => {
    const message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }
    set((state) => ({
      messages: [...state.messages, message],
      isStreaming: true,
      currentStreamingMessage: message.id,
    }))
    return message.id
  },

  // Append token to the currently streaming message
  appendToken: (token) => {
    const messageId = get().currentStreamingMessage
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, content: msg.content + token } : msg
      ),
    }))
  },

  // End streaming
  endStreaming: () => {
    set({
      isStreaming: false,
      currentStreamingMessage: null,
    })
  },

  // Add a complete assistant message (non-streaming)
  addAssistantMessage: (content) => {
    const message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'assistant',
      content,
      timestamp: Date.now(),
    }
    set((state) => ({
      messages: [...state.messages, message],
    }))
    return message
  },

  // Clear all messages
  clearMessages: () => {
    set({
      messages: [],
      isStreaming: false,
      isLoading: false,
      currentStreamingMessage: null,
    })
  },

  // Load messages (e.g., from history)
  loadMessages: (messages) => {
    set({ messages })
  },
}))

export { useChatStore }

