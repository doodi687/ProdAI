"""
Pydantic Models for ProdAI
"""

from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class Platform(str, Enum):
    AMAZON = "amazon"
    FLIPKART = "flipkart"
    UNKNOWN = "unknown"

class ProductLink(BaseModel):
    url: str = Field(..., description="Product URL to analyze")

class ProductPrice(BaseModel):
    platform: str
    price: float
    currency: str = "INR"
    original_price: Optional[float] = None
    discount_percentage: Optional[float] = None
    url: str
    in_stock: bool = True
    last_updated: datetime = Field(default_factory=datetime.now)

class ProductSpecification(BaseModel):
    name: str
    value: str
    category: Optional[str] = None

class ProductDetails(BaseModel):
    id: Optional[str] = None
    title: str
    description: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    images: List[str] = []
    rating: Optional[float] = None
    review_count: Optional[int] = None
    specifications: List[ProductSpecification] = []
    prices: List[ProductPrice] = []
    platform: str
    url: str
    scraped_at: datetime = Field(default_factory=datetime.now)

class ProsCons(BaseModel):
    pros: List[str]
    cons: List[str]
    summary: str
    recommendation: str

class ChatMessage(BaseModel):
    role: str = Field(..., description="Role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")

class ChatRequest(BaseModel):
    message: str = Field(..., description="User's question")
    product_context: Optional[Dict[str, Any]] = None
    conversation_history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    response: str
    suggestions: List[str] = []

class CompareRequest(BaseModel):
    products: List[str] = Field(..., description="List of product URLs to compare")

class ComparisonResult(BaseModel):
    products: List[ProductDetails]
    comparison_table: Dict[str, List[str]]
    ai_analysis: str
    winner: Optional[str] = None
    recommendation: str

class RecommendationRequest(BaseModel):
    query: str = Field(..., description="User query for product recommendations")
    category: Optional[str] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None

class RecommendedProduct(BaseModel):
    title: str
    description: str
    estimated_price_range: str
    why_recommended: str
    search_query: str

class RecommendationResponse(BaseModel):
    recommendations: List[RecommendedProduct]
    search_tips: List[str]
