"""
Products Router - Product Link Analyzer & Feature Extraction
"""

from fastapi import APIRouter, HTTPException
from models import ProductLink, ProductDetails, ProsCons
from services.scraper import scraper
from services.ai_service import ai_service

router = APIRouter()

@router.post("/analyze", response_model=ProductDetails)
async def analyze_product(request: ProductLink):
    """
    Analyze a product from its URL.
    Extracts title, price, specifications, images, and more.
    """
    try:
        product = await scraper.scrape_product(request.url)
        if not product:
            raise HTTPException(
                status_code=400, 
                detail="Could not extract product information. Please check the URL and try again."
            )
        return product
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing product: {str(e)}")

@router.post("/pros-cons", response_model=ProsCons)
async def get_pros_cons(request: ProductLink):
    """
    Get AI-generated pros and cons analysis for a product.
    """
    try:
        product = await scraper.scrape_product(request.url)
        if not product:
            raise HTTPException(
                status_code=400,
                detail="Could not extract product information for analysis."
            )
        
        analysis = ai_service.analyze_product(product)
        return analysis
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing product: {str(e)}")

@router.post("/analyze-full")
async def analyze_product_full(request: ProductLink):
    """
    Get complete product analysis including details and pros/cons.
    """
    try:
        product = await scraper.scrape_product(request.url)
        if not product:
            raise HTTPException(
                status_code=400,
                detail="Could not extract product information."
            )
        
        analysis = ai_service.analyze_product(product)
        
        return {
            "product": product,
            "analysis": analysis
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.get("/demo")
async def get_demo_product():
    """
    Returns a demo product for testing the UI without actual scraping.
    """
    return {
        "product": {
            "title": "Samsung Galaxy S24 Ultra 5G (Titanium Black, 256GB, 12GB RAM)",
            "description": "The ultimate smartphone experience with advanced AI features, 200MP camera, and S Pen support.",
            "brand": "Samsung",
            "category": "Smartphones",
            "image_url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
            "images": ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400"],
            "rating": 4.5,
            "review_count": 12543,
            "specifications": [
                {"name": "Display", "value": "6.8 inch Dynamic AMOLED 2X"},
                {"name": "Processor", "value": "Snapdragon 8 Gen 3"},
                {"name": "RAM", "value": "12 GB"},
                {"name": "Storage", "value": "256 GB"},
                {"name": "Camera", "value": "200 MP + 12 MP + 50 MP + 10 MP"},
                {"name": "Battery", "value": "5000 mAh"},
                {"name": "OS", "value": "Android 14, One UI 6.1"}
            ],
            "prices": [
                {
                    "platform": "Amazon",
                    "price": 129999,
                    "original_price": 149999,
                    "discount_percentage": 13.3,
                    "currency": "INR",
                    "url": "https://amazon.in",
                    "in_stock": True
                },
                {
                    "platform": "Flipkart",
                    "price": 127999,
                    "original_price": 149999,
                    "discount_percentage": 14.7,
                    "currency": "INR",
                    "url": "https://flipkart.com",
                    "in_stock": True
                }
            ],
            "platform": "Demo",
            "url": "https://example.com"
        },
        "analysis": {
            "pros": [
                "Outstanding 200MP camera with advanced AI photo features",
                "Powerful Snapdragon 8 Gen 3 processor for smooth performance",
                "Excellent 6.8-inch Dynamic AMOLED display with 120Hz refresh rate",
                "Long-lasting 5000mAh battery with fast charging",
                "S Pen support for productivity and creativity"
            ],
            "cons": [
                "Premium price point may not suit all budgets",
                "Large size might be uncomfortable for one-handed use",
                "No expandable storage option"
            ],
            "summary": "The Samsung Galaxy S24 Ultra is a flagship smartphone that excels in camera quality, display technology, and overall performance. It's designed for power users who want the best Android experience.",
            "recommendation": "Ideal for photography enthusiasts, power users, and professionals who need a reliable, feature-rich smartphone and are willing to invest in premium quality."
        }
    }
