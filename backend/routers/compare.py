"""
Compare Router - Product Comparison Engine
"""

from fastapi import APIRouter, HTTPException
from typing import List
from models import CompareRequest, ComparisonResult, ProductDetails
from services.scraper import scraper
from services.ai_service import ai_service
import asyncio

router = APIRouter()

@router.post("/products")
async def compare_products(request: CompareRequest):
    """
    Compare multiple products from their URLs.
    Returns side-by-side comparison with AI analysis.
    """
    if len(request.products) < 2:
        raise HTTPException(status_code=400, detail="Please provide at least 2 products to compare")
    
    if len(request.products) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 products can be compared at once")
    
    try:
        # Fetch all products in parallel
        tasks = [scraper.scrape_product(url) for url in request.products]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        products = []
        failed_urls = []
        
        for i, result in enumerate(results):
            if isinstance(result, Exception) or result is None:
                failed_urls.append(request.products[i])
            else:
                products.append(result)
        
        if len(products) < 2:
            raise HTTPException(
                status_code=400, 
                detail=f"Could not extract enough products. Failed URLs: {failed_urls}"
            )
        
        # Build comparison table
        comparison_table = build_comparison_table(products)
        
        # Get AI analysis (synchronous call)
        ai_analysis = ai_service.compare_products(products)
        
        # Find winner based on value (price/rating ratio)
        winner = find_best_value(products)
        
        return {
            "products": products,
            "comparison_table": comparison_table,
            "ai_analysis": ai_analysis,
            "winner": winner,
            "recommendation": f"Based on price and ratings, {winner} offers the best value." if winner else "Consider your specific needs when choosing."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison error: {str(e)}")

def build_comparison_table(products: List[ProductDetails]) -> dict:
    """Build a comparison table from products"""
    table = {
        "Title": [p.title[:50] + "..." if len(p.title) > 50 else p.title for p in products],
        "Price": [f"₹{p.prices[0].price:,.0f}" if p.prices else "N/A" for p in products],
        "Rating": [f"{p.rating}/5" if p.rating else "N/A" for p in products],
        "Reviews": [f"{p.review_count:,}" if p.review_count else "N/A" for p in products],
        "Brand": [p.brand or "Unknown" for p in products],
        "Platform": [p.platform for p in products]
    }
    
    # Add common specifications
    all_specs = {}
    for product in products:
        for spec in product.specifications:
            if spec.name not in all_specs:
                all_specs[spec.name] = []
            all_specs[spec.name].append((product.title, spec.value))
    
    # Add specs that exist in at least 2 products
    for spec_name, values in all_specs.items():
        if len(values) >= 2 and spec_name not in ["Feature 1", "Feature 2", "Highlight 1"]:
            spec_values = []
            for product in products:
                found = False
                for spec in product.specifications:
                    if spec.name == spec_name:
                        spec_values.append(spec.value[:50] if len(spec.value) > 50 else spec.value)
                        found = True
                        break
                if not found:
                    spec_values.append("-")
            table[spec_name] = spec_values
    
    return table

def find_best_value(products: List[ProductDetails]) -> str:
    """Find the best value product based on price and rating"""
    if not products:
        return None
    
    best = None
    best_score = -1
    
    for p in products:
        if p.prices and p.rating:
            # Value score: higher rating, lower price is better
            price = p.prices[0].price
            if price > 0:
                score = (p.rating / 5) * (1 / (price / 10000))
                if score > best_score:
                    best_score = score
                    best = p.title
    
    return best if best else products[0].title

@router.get("/demo")
async def get_demo_comparison():
    """
    Returns a demo comparison for testing the UI.
    """
    return {
        "products": [
            {
                "title": "iPhone 15 Pro Max (256GB)",
                "brand": "Apple",
                "image_url": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
                "rating": 4.7,
                "review_count": 8234,
                "prices": [{"platform": "Amazon", "price": 159900, "discount_percentage": 5}],
                "platform": "Amazon",
                "url": "https://amazon.in"
            },
            {
                "title": "Samsung Galaxy S24 Ultra (256GB)",
                "brand": "Samsung",
                "image_url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
                "rating": 4.5,
                "review_count": 12543,
                "prices": [{"platform": "Flipkart", "price": 129999, "discount_percentage": 14}],
                "platform": "Flipkart",
                "url": "https://flipkart.com"
            }
        ],
        "comparison_table": {
            "Title": ["iPhone 15 Pro Max", "Galaxy S24 Ultra"],
            "Price": ["₹1,59,900", "₹1,29,999"],
            "Rating": ["4.7/5", "4.5/5"],
            "Display": ["6.7\" Super Retina XDR", "6.8\" Dynamic AMOLED 2X"],
            "Processor": ["A17 Pro", "Snapdragon 8 Gen 3"],
            "Camera": ["48MP + 12MP + 12MP", "200MP + 12MP + 50MP + 10MP"],
            "Battery": ["4441 mAh", "5000 mAh"],
            "Storage": ["256 GB", "256 GB"]
        },
        "ai_analysis": "Both phones are flagship devices with excellent performance. The iPhone 15 Pro Max offers superior video capabilities and a more refined software experience, while the Samsung Galaxy S24 Ultra provides a better camera system for photography, larger display, and more customization options. The Samsung also offers better value at a lower price point.",
        "winner": "Samsung Galaxy S24 Ultra",
        "recommendation": "If you prefer iOS and value video quality, go for iPhone. If you want the best camera for photos, a larger screen, and better value, choose Samsung."
    }
