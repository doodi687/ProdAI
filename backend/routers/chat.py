"""
Chat Router - AI Chatbot for Product Queries
"""

from fastapi import APIRouter, HTTPException
from models import ChatRequest, ChatResponse
from services.ai_service import ai_service

router = APIRouter()

@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """
    Send a message to the AI chatbot.
    Optionally include product context for more relevant responses.
    """
    try:
        response, suggestions = ai_service.chat(
            message=request.message,
            product_context=request.product_context,
            history=request.conversation_history
        )
        
        return ChatResponse(
            response=response,
            suggestions=suggestions
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@router.get("/status")
async def chat_status():
    """
    Check if AI chat service is available.
    """
    return {
        "available": ai_service.is_available(),
        "model": ai_service.model if ai_service.is_available() else "fallback",
        "message": "AI service is ready" if ai_service.is_available() else "Running in fallback mode (set GROQ_API_KEY for full features)"
    }
