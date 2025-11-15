/**
 * API utilities for backend communication
 */

// Get API base URL from environment variable
// In production, this MUST be set to your Railway backend URL
// In development, it defaults to '/v1' which uses Vite proxy
const API_BASE = import.meta.env.VITE_API_URL || '/v1'

// Validate API_BASE on load
if (typeof window !== 'undefined') {
  console.log('🔗 API Base URL:', API_BASE)
  
  // Warn if using relative URL in production
  if (API_BASE.startsWith('/') && window.location.hostname !== 'localhost') {
    console.warn(
      '⚠️ WARNING: Using relative API URL in production. ' +
      'Set VITE_API_URL environment variable to your Railway backend URL.'
    )
  }
}

/**
 * Generate a unique request ID for tracing
 */
export function generateRequestId() {
  return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Fetch JSON with error handling
 */
export async function fetchJSON(url, options = {}) {
  const requestId = generateRequestId()
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': requestId,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: { message: response.statusText },
      }))
      throw new Error(error.error?.message || `Request failed with status ${response.status}`)
    }

    return response.json()
  } catch (error) {
    // Enhance error message for common CORS/network issues
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      console.error('❌ Network Error Details:', {
        url,
        API_BASE,
        error: error.message,
        possibleCauses: [
          'CORS not configured on backend',
          'Backend not running or unreachable',
          'Wrong API URL in VITE_API_URL',
          'Mixed content (HTTP/HTTPS)',
        ]
      })
      throw new Error(
        `Cannot connect to backend at ${url}. ` +
        `Check console for details. Ensure VITE_API_URL is set correctly.`
      )
    }
    throw error
  }
}

/**
 * Post to chat endpoint (non-streaming)
 */
export async function postChat({ sessionId, conversationId, messages, metadata = {} }) {
  return fetchJSON(`${API_BASE}/chat`, {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
      conversation_id: conversationId,
      messages,
      metadata,
    }),
  })
}

/**
 * Stream chat via SSE
 */
export function streamChat({ sessionId, conversationId, messages, metadata = {}, onEvent }) {
  const requestId = generateRequestId()
  
  const eventSource = new EventSource(
    `${API_BASE}/chat/stream?` +
      new URLSearchParams({
        session_id: sessionId,
        conversation_id: conversationId,
      })
  )

  // Send the POST data via fetch first (EventSource doesn't support POST)
  fetch(`${API_BASE}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Request-Id': requestId,
    },
    body: JSON.stringify({
      session_id: sessionId,
      conversation_id: conversationId,
      messages,
      metadata,
    }),
  })

  eventSource.addEventListener('token', (e) => {
    const data = JSON.parse(e.data)
    onEvent({ type: 'token', data })
  })

  eventSource.addEventListener('tool_call', (e) => {
    const data = JSON.parse(e.data)
    onEvent({ type: 'tool_call', data })
  })

  eventSource.addEventListener('tool_result', (e) => {
    const data = JSON.parse(e.data)
    onEvent({ type: 'tool_result', data })
  })

  eventSource.addEventListener('message_end', (e) => {
    const data = JSON.parse(e.data)
    onEvent({ type: 'message_end', data })
    eventSource.close()
  })

  eventSource.addEventListener('error', (e) => {
    const data = e.data ? JSON.parse(e.data) : { message: 'Stream error' }
    onEvent({ type: 'error', data })
    eventSource.close()
  })

  eventSource.onerror = () => {
    onEvent({ type: 'error', data: { message: 'Connection error' } })
    eventSource.close()
  }

  return eventSource
}

/**
 * Get conversation messages
 */
export async function getConversationMessages(sessionId, conversationId, limit = 50) {
  return fetchJSON(`${API_BASE}/conversations/${conversationId}/messages`, {
    headers: {
      'X-Client-Session': sessionId,
    },
  })
}

/**
 * Delete conversation
 */
export async function deleteConversation(sessionId, conversationId) {
  return fetchJSON(`${API_BASE}/conversations/${conversationId}`, {
    method: 'DELETE',
    headers: {
      'X-Client-Session': sessionId,
    },
  })
}

/**
 * Health check
 */
export async function healthCheck() {
  return fetchJSON(`${API_BASE}/health`)
}

