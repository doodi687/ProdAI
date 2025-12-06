"""
Recommendations Router - AI Product Recommendations
"""

from fastapi import APIRouter, HTTPException
from models import RecommendationRequest, RecommendationResponse, RecommendedProduct
from services.ai_service import ai_service

router = APIRouter()

@router.post("/suggest")
async def get_recommendations(request: RecommendationRequest):
    """
    Get AI-powered product recommendations based on user query.
    """
    try:
        recommendations = await ai_service.get_recommendations(
            query=request.query,
            category=request.category,
            budget_min=request.budget_min,
            budget_max=request.budget_max
        )
        
        # Convert to proper format
        formatted_recs = []
        for rec in recommendations:
            formatted_recs.append(RecommendedProduct(
                title=rec.get("title", ""),
                description=rec.get("description", ""),
                estimated_price_range=rec.get("estimated_price_range", ""),
                why_recommended=rec.get("why_recommended", ""),
                search_query=rec.get("search_query", "")
            ))
        
        return {
            "recommendations": formatted_recs,
            "search_tips": [
                "Compare prices across multiple platforms",
                "Check customer reviews before purchasing",
                "Look for ongoing sales and discounts"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")

@router.get("/trending")
async def get_trending():
    """
    Get trending product categories and popular searches.
    """
    return {
        "trending_categories": [
            {"name": "Smartphones", "icon": "📱", "searches": 15234},
            {"name": "Laptops", "icon": "💻", "searches": 12543},
            {"name": "Headphones", "icon": "🎧", "searches": 9876},
            {"name": "Smartwatches", "icon": "⌚", "searches": 8543},
            {"name": "Cameras", "icon": "📷", "searches": 6234}
        ],
        "popular_searches": [
            "iPhone 15 vs Samsung S24",
            "Best budget laptops under 50000",
            "Wireless earbuds with ANC",
            "4K Smart TV 55 inch",
            "Gaming mouse under 2000"
        ]
    }

@router.get("/demo")
async def get_demo_recommendations():
    """
    Returns demo recommendations for testing the UI.
    """
    return {
        "recommendations": [
            {
                "title": "Samsung Galaxy S24 Ultra",
                "description": "Flagship smartphone with 200MP camera and S Pen support",
                "estimated_price_range": "₹1,20,000 - ₹1,50,000",
                "why_recommended": "Best Android camera phone with AI features",
                "search_query": "Samsung Galaxy S24 Ultra"
            },
            {
                "title": "iPhone 15 Pro Max",
                "description": "Apple's most advanced iPhone with A17 Pro chip",
                "estimated_price_range": "₹1,50,000 - ₹1,80,000",
                "why_recommended": "Best for iOS users and video creators",
                "search_query": "iPhone 15 Pro Max"
            },
            {
                "title": "Google Pixel 8 Pro",
                "description": "Pure Android experience with exceptional camera",
                "estimated_price_range": "₹90,000 - ₹1,10,000",
                "why_recommended": "Best software experience and 7 years of updates",
                "search_query": "Google Pixel 8 Pro"
            }
        ],
        "search_tips": [
            "Compare prices across Amazon, Flipkart, and brand stores",
            "Check for bank offers and exchange deals",
            "Read user reviews focusing on long-term usage"
        ]
    }
