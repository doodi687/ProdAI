# ProdAI - AI-powered Product Comparison and Shopping Assistant

![ProdAI Banner](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop)

## 🚀 Overview

**ProdAI** is an AI-powered product comparison and shopping assistant that helps users make smarter shopping decisions. It extracts product information from e-commerce sites, compares prices, analyzes features, and provides AI-powered recommendations.

### 👥 Team Details

| Name | Roll Number |
|------|-------------|
| Vishal Doodi | 23UADS4148 |
| Dev Kumar Agarwal | 23UADS4113 |

- **Branch:** Artificial Intelligence & Data Science
- **Semester:** VII
- **Guide:** Dr. Alok Singh Gehlot

## ✨ Features

1. **Product Link Analyzer** - Paste any product link (Amazon, Flipkart, etc.) and get detailed information
2. **Price Comparison Engine** - Compare prices across multiple e-commerce platforms
3. **Feature Extraction** - View product specifications in a clean, organized format
4. **Pros & Cons Analysis** - AI-generated analysis of product strengths and limitations
5. **Recommendation System** - Smart product suggestions based on your needs
6. **AI Chatbot Assistant** - Ask natural questions like "Is this better than iPhone 14?"

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - State management
- **Lucide React** - Beautiful icons

### Backend
- **FastAPI** - High-performance Python framework
- **BeautifulSoup** - Web scraping
- **OpenAI API** - AI-powered analysis and chatbot
- **Pydantic** - Data validation
- **HTTPX** - Async HTTP client

### Deployment
- **Frontend:** Render Static Site
- **Backend:** Render Web Service

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.9+
- Git

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Run the server
python main.py
```

The backend will be running at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional - for production API URL)
echo "VITE_API_URL=http://localhost:8000" > .env

# Run development server
npm run dev
```

The frontend will be running at `http://localhost:5173`

## 🚀 Deployment on Render

### Deploy Backend

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables:**
     - `OPENAI_API_KEY` - Your OpenAI API key
     - `FRONTEND_URL` - Your frontend URL

### Deploy Frontend

1. Create a new **Static Site** on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variables:**
     - `VITE_API_URL` - Your backend URL (e.g., `https://prodai-backend.onrender.com`)

## 📁 Project Structure

```
ProdAI/
├── backend/
│   ├── main.py              # FastAPI application entry
│   ├── models.py            # Pydantic data models
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment variables template
│   ├── routers/
│   │   ├── products.py      # Product analysis endpoints
│   │   ├── chat.py          # AI chatbot endpoints
│   │   ├── compare.py       # Comparison endpoints
│   │   └── recommendations.py
│   └── services/
│       ├── scraper.py       # Web scraping service
│       └── ai_service.py    # OpenAI integration
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── main.jsx         # Entry point
│   │   ├── index.css        # Global styles
│   │   ├── api/             # API client
│   │   ├── store/           # Zustand state
│   │   ├── components/      # Reusable components
│   │   └── pages/           # Page components
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## 🔑 API Endpoints

### Products
- `POST /api/products/analyze` - Analyze a product URL
- `POST /api/products/pros-cons` - Get AI pros/cons analysis
- `POST /api/products/analyze-full` - Complete product analysis

### Compare
- `POST /api/compare/products` - Compare multiple products

### Chat
- `POST /api/chat/message` - Send message to AI chatbot
- `GET /api/chat/status` - Check AI service status

### Recommendations
- `POST /api/recommendations/suggest` - Get product recommendations
- `GET /api/recommendations/trending` - Get trending products

## 🎨 Screenshots

### Home Page
The landing page with animated gradient backgrounds and feature highlights.

### Product Analyzer
Paste a product link to get detailed information, specifications, and AI analysis.

### Price Comparison
Compare products side-by-side with AI-powered insights.

### AI Chat Assistant
Interactive chatbot for shopping queries and product questions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for educational purposes as part of the Semester VII curriculum.

## 🙏 Acknowledgments

- Dr. Alok Singh Gehlot for project guidance
- OpenAI for the GPT API
- The open-source community for amazing tools and libraries

---

Made with ❤️ by Vishal Doodi & Dev Kumar Agarwal
