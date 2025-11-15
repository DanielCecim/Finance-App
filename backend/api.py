"""
FastAPI backend for the Finance Agent.
Exposes REST and SSE endpoints for agent communication.
"""
from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sse_starlette.sse import EventSourceResponse
import json
import uuid
import sys
import os
from datetime import datetime
import yfinance as yf

# Import agent from local module
from agent import agent

app = FastAPI(title="Finance Agent API", version="1.0.0")

# CORS configuration - read from environment variable for production
# Format: comma-separated list of origins
# Example: "https://yourdomain.vercel.app,https://www.yourdomain.com"
cors_origins_str = os.getenv(
    "CORS_ORIGINS", 
    "http://localhost:3000,http://127.0.0.1:3000"
)
cors_origins = [origin.strip() for origin in cors_origins_str.split(",")]

print(f"🔒 CORS enabled for origins: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Request/Response Models
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    session_id: str
    conversation_id: str
    messages: List[Message]
    metadata: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    id: str
    role: str
    content: str
    events: List[Dict[str, Any]] = []
    usage: Optional[Dict[str, int]] = None

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str

# In-memory session store (replace with Redis in production)
sessions = {}

# Explicit OPTIONS handler for preflight requests
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    """Handle preflight OPTIONS requests"""
    return {"status": "ok"}

@app.get("/v1/health")
async def health_check() -> HealthResponse:
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        timestamp=datetime.utcnow().isoformat()
    )

@app.get("/v1/debug/cors")
async def debug_cors():
    """Debug endpoint to check CORS configuration"""
    return {
        "cors_origins": cors_origins,
        "environment": os.getenv("ENVIRONMENT", "development"),
        "message": "If you can see this from your frontend, CORS is working!"
    }

@app.post("/v1/chat")
async def chat(
    request: ChatRequest,
    x_request_id: Optional[str] = Header(None),
) -> ChatResponse:
    """Non-streaming chat endpoint"""
    try:
        # Get the last user message
        user_message = next((m.content for m in reversed(request.messages) if m.role == "user"), "")
        
        if not user_message:
            raise HTTPException(status_code=400, detail="No user message found")
        
        # Run agent
        response = agent.run(user_message)
        response_text = response.content if hasattr(response, 'content') else str(response)
        
        # Store in session
        session_key = f"{request.session_id}:{request.conversation_id}"
        if session_key not in sessions:
            sessions[session_key] = []
        
        sessions[session_key].extend([
            {"role": "user", "content": user_message},
            {"role": "assistant", "content": response_text}
        ])
        
        return ChatResponse(
            id=str(uuid.uuid4()),
            role="assistant",
            content=response_text,
            events=[],
            usage={"input_tokens": 0, "output_tokens": 0}
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": str(e),
                    "trace_id": x_request_id or str(uuid.uuid4())
                }
            }
        )

@app.post("/v1/chat/stream")
async def chat_stream(
    request: ChatRequest,
    x_request_id: Optional[str] = Header(None),
):
    """Streaming chat endpoint using SSE"""
    async def event_generator():
        try:
            # Get the last user message
            user_message = next((m.content for m in reversed(request.messages) if m.role == "user"), "")
            
            if not user_message:
                yield {
                    "event": "error",
                    "data": json.dumps({
                        "code": "BAD_REQUEST",
                        "message": "No user message found"
                    })
                }
                return
            
            # Store user message
            session_key = f"{request.session_id}:{request.conversation_id}"
            if session_key not in sessions:
                sessions[session_key] = []
            sessions[session_key].append({"role": "user", "content": user_message})
            
            # Run agent (for now, non-streaming - can be enhanced with agent streaming)
            response = agent.run(user_message)
            response_text = response.content if hasattr(response, 'content') else str(response)
            
            # Store assistant message
            sessions[session_key].append({"role": "assistant", "content": response_text})
            
            # Simulate streaming by sending chunks
            # In a real implementation, you'd hook into the agent's streaming capability
            words = response_text.split(' ')
            for i, word in enumerate(words):
                chunk = word + (' ' if i < len(words) - 1 else '')
                yield {
                    "event": "token",
                    "data": json.dumps({"delta": chunk})
                }
            
            # Send completion event
            message_id = str(uuid.uuid4())
            yield {
                "event": "message_end",
                "data": json.dumps({
                    "message_id": message_id,
                    "usage": {"input_tokens": 0, "output_tokens": len(words)}
                })
            }
            
        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps({
                    "code": "INTERNAL_ERROR",
                    "message": str(e),
                    "trace_id": x_request_id or str(uuid.uuid4())
                })
            }
    
    return EventSourceResponse(event_generator())

@app.get("/v1/conversations/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: str,
    session_id: str = Header(None, alias="X-Client-Session"),
    limit: int = 50
):
    """Get conversation history"""
    session_key = f"{session_id}:{conversation_id}"
    messages = sessions.get(session_key, [])
    return {"messages": messages[-limit:]}

@app.delete("/v1/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    session_id: str = Header(None, alias="X-Client-Session"),
):
    """Delete a conversation"""
    session_key = f"{session_id}:{conversation_id}"
    if session_key in sessions:
        del sessions[session_key]
    return {"status": "deleted"}

@app.get("/v1/stocks/{symbol}/data")
async def get_stock_data(symbol: str, period: str = "1y"):
    """
    Get stock data using yfinance.
    This proxies the request to avoid CORS issues.
    """
    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period)
        
        if df.empty:
            raise HTTPException(status_code=404, detail=f"No data found for symbol {symbol}")
        
        # Convert DataFrame to list of dictionaries
        df_reset = df.reset_index()
        data = []
        
        for _, row in df_reset.iterrows():
            data.append({
                "Date": row['Date'].isoformat() if hasattr(row['Date'], 'isoformat') else str(row['Date']),
                "Open": float(row['Open']) if 'Open' in row and row['Open'] is not None else None,
                "High": float(row['High']) if 'High' in row and row['High'] is not None else None,
                "Low": float(row['Low']) if 'Low' in row and row['Low'] is not None else None,
                "Close": float(row['Close']) if 'Close' in row and row['Close'] is not None else None,
                "Volume": int(row['Volume']) if 'Volume' in row and row['Volume'] is not None else 0,
            })
        
        return {
            "symbol": symbol.upper(),
            "period": period,
            "data": data
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching stock data: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

