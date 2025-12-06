"""
ProdAI Backend - Main Application Entry Point
AI-powered Product Comparison and Shopping Assistant
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from routers import products, chat, compare, recommendations

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 ProdAI Backend Starting...")
    yield
    # Shutdown
    print("👋 ProdAI Backend Shutting Down...")

app = FastAPI(
    title="ProdAI API",
    description="AI-powered Product Comparison and Shopping Assistant API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = [
    frontend_url,
    "http://localhost:5173",
    "http://localhost:3000",
    "https://*.onrender.com",
    "https://*.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(compare.router, prefix="/api/compare", tags=["Compare"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to ProdAI API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "products": "/api/products",
            "chat": "/api/chat",
            "compare": "/api/compare",
            "recommendations": "/api/recommendations"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ProdAI Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
