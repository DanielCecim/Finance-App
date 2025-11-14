import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Session store for managing user session and conversation state
 */
const useSessionStore = create(
  persist(
    (set, get) => ({
      sessionId: null,
      conversationId: null,

      // Initialize or restore session
      initSession: () => {
        const state = get()
        if (!state.sessionId) {
          set({
            sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            conversationId: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          })
        }
      },

      // Create new conversation
      newConversation: () => {
        set({
          conversationId: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        })
      },

      // Get current IDs
      getIds: () => {
        const state = get()
        return {
          sessionId: state.sessionId,
          conversationId: state.conversationId,
        }
      },
    }),
    {
      name: 'finance-session',
      partialize: (state) => ({
        sessionId: state.sessionId,
        conversationId: state.conversationId,
      }),
    }
  )
)

export { useSessionStore }

