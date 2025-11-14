# Finance App - JavaScript Frontend

A modern React-based stock dashboard with AI financial analyst powered by Agno agents.

## Features

- 📈 **Interactive Stock Dashboard**: Real-time stock data visualization with Plotly charts
- 🤖 **AI Financial Analyst**: Chat interface powered by Agno agent with financial tools
- 📊 **Technical Indicators**: RSI, Moving Averages, Bollinger Bands
- 💾 **Data Export**: Download stock data in CSV or JSON format
- 🎨 **Modern UI**: Clean, responsive design following UX best practices
- ⚡ **Fast & Lightweight**: Built with Vite for optimal performance

## Architecture

### Frontend (React + Vite)
- **Feature-based architecture** with isolated chat and dashboard modules
- **State management** using Zustand for lightweight, performant state
- **Charts** powered by Plotly.js for interactive visualizations
- **Session management** with localStorage persistence

### Backend (FastAPI + Agno)
- **REST API** endpoints for chat and data retrieval
- **SSE streaming** support for real-time agent responses
- **Agno agent** integration with YFinance tools
- **Conversation memory** for context-aware interactions

## Project Structure

```
FinanceApp/
├── backend/
│   ├── api.py              # FastAPI server with agent endpoints
│   └── requirements.txt    # Python dependencies
├── src/
│   ├── app/                # App shell and routing
│   ├── features/
│   │   ├── chat/          # Chat feature with agent integration
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── state/
│   │   └── dashboard/     # Stock dashboard feature
│   │       ├── components/
│   │       └── state/
│   ├── shared/
│   │   ├── components/    # Reusable UI components
│   │   ├── state/         # Global state management
│   │   └── utils/         # API utilities and helpers
│   └── styles/            # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- OpenAI API key

### Installation

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the `backend` directory:
   ```env
   OPENAI_API_KEY=your_api_key_here
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   npm run backend
   # or manually:
   cd backend && uvicorn api:app --reload --port 8000
   ```

2. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Usage

### Stock Dashboard

1. Enter a stock symbol (e.g., AAPL, MSFT, GOOGL)
2. Select a time period
3. Click "Load Data"
4. Explore the interactive charts and metrics
5. Switch between tabs to view different analyses

### AI Financial Analyst

1. Open the chat sidebar (always visible on the right)
2. Ask questions about stocks, market analysis, or financial data
3. The AI agent has access to real-time financial data through YFinance tools
4. Conversation history is maintained across the session

### Example Questions for the AI Agent

- "What's the current price of Apple stock?"
- "Analyze the performance of TSLA over the last year"
- "Show me the key financial ratios for Microsoft"
- "What are analysts recommending for Amazon stock?"
- "Give me the latest news about Nvidia"

## API Endpoints

### Backend API (Port 8000)

- `GET /v1/health` - Health check
- `POST /v1/chat` - Send message to agent (non-streaming)
- `POST /v1/chat/stream` - Stream agent responses via SSE
- `GET /v1/conversations/{id}/messages` - Get conversation history
- `DELETE /v1/conversations/{id}` - Delete conversation

## Development

### Commands

- `npm run dev` - Start frontend dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run backend` - Start backend server

### Best Practices

This project follows the coding best practices outlined in `coding_best_practices.md`:

- ✅ Feature-based folder structure
- ✅ Session and conversation tracking
- ✅ Error boundaries and resilient error handling
- ✅ Semantic HTML and accessibility
- ✅ Responsive design
- ✅ Performance optimization
- ✅ API contract versioning (v1)

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Zustand** - State management
- **Plotly.js** - Interactive charts
- **ESLint + Prettier** - Code quality

### Backend
- **FastAPI** - Modern Python web framework
- **Agno** - AI agent framework
- **YFinance** - Financial data
- **SSE-Starlette** - Server-sent events

## Production Deployment

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Serve the frontend:**
   The `dist/` folder contains static files that can be served by any web server (Nginx, Apache, etc.)

3. **Deploy the backend:**
   ```bash
   cd backend
   uvicorn api:app --host 0.0.0.0 --port 8000
   ```

4. **Environment configuration:**
   - Set `OPENAI_API_KEY` environment variable
   - Configure CORS origins in `api.py`
   - Use a production ASGI server (Gunicorn + Uvicorn)
   - Add rate limiting and authentication as needed

## License

MIT

## Support

For issues or questions, please open an issue in the repository.

