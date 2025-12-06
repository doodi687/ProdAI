"""
AI Service - Groq Integration for Product Analysis and Chatbot
Using Groq for fast, free LLM inference
"""

import os
from typing import List, Dict, Any, Optional
from groq import Groq
from models import ProductDetails, ProsCons, ChatMessage
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        self.client = Groq(api_key=api_key) if api_key and api_key != "your_groq_api_key_here" else None
        self.model = "llama-3.3-70b-versatile"  # Latest available model
    
    def is_available(self) -> bool:
        """Check if AI service is available"""
        return self.client is not None
    
    def analyze_product(self, product: ProductDetails) -> ProsCons:
        """Generate pros/cons analysis for a product"""
        if not self.is_available():
            return self._fallback_analysis(product)
        
        try:
            specs_text = "\n".join([f"- {s.name}: {s.value}" for s in product.specifications[:10]])
            
            prompt = f"""Analyze this product and provide pros, cons, a brief summary, and a recommendation.

Product: {product.title}
Brand: {product.brand or 'Unknown'}
Price: ₹{product.prices[0].price if product.prices else 'N/A'}
Rating: {product.rating}/5 ({product.review_count} reviews)

Specifications:
{specs_text}

Description: {product.description or 'N/A'}

Provide your analysis in the following JSON format only, no other text:
{{
    "pros": ["pro1", "pro2", "pro3", "pro4"],
    "cons": ["con1", "con2", "con3"],
    "summary": "A brief 2-3 sentence summary of the product",
    "recommendation": "Who should buy this and why"
}}"""

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful product analyst. Provide honest, balanced analysis. Respond only with valid JSON, no markdown."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            import json
            content = response.choices[0].message.content
            # Try to extract JSON from the response
            try:
                data = json.loads(content)
            except json.JSONDecodeError:
                # Try to find JSON in the response
                import re
                json_match = re.search(r'\{[\s\S]*\}', content)
                if json_match:
                    data = json.loads(json_match.group())
                else:
                    return self._fallback_analysis(product)
            
            return ProsCons(
                pros=data.get("pros", []),
                cons=data.get("cons", []),
                summary=data.get("summary", ""),
                recommendation=data.get("recommendation", "")
            )
            
        except Exception as e:
            print(f"AI analysis error: {e}")
            return self._fallback_analysis(product)
    
    def _fallback_analysis(self, product: ProductDetails) -> ProsCons:
        """Fallback analysis when AI is not available"""
        pros = []
        cons = []
        
        # Generate basic analysis from available data
        if product.rating:
            if product.rating >= 4.0:
                pros.append(f"High customer rating ({product.rating}/5)")
            elif product.rating < 3.0:
                cons.append(f"Below average rating ({product.rating}/5)")
        
        if product.review_count:
            if product.review_count >= 1000:
                pros.append(f"Popular product with {product.review_count} reviews")
            elif product.review_count < 50:
                cons.append("Limited customer reviews available")
        
        if product.prices:
            price = product.prices[0]
            if price.discount_percentage and price.discount_percentage >= 20:
                pros.append(f"Great discount of {price.discount_percentage}% off")
            if price.price < 1000:
                pros.append("Budget-friendly price")
            elif price.price > 50000:
                cons.append("Premium price point")
        
        if product.brand:
            pros.append(f"From {product.brand} brand")
        
        # Add some generic points
        if len(pros) < 3:
            pros.extend([
                "Available for online purchase",
                "Product specifications available"
            ])
        
        if len(cons) < 2:
            cons.extend([
                "Consider comparing with alternatives",
                "Check return policy before purchase"
            ])
        
        return ProsCons(
            pros=pros[:5],
            cons=cons[:4],
            summary=f"{product.title} is available for ₹{product.prices[0].price if product.prices else 'N/A'}. " + 
                   (f"It has a {product.rating}/5 rating from {product.review_count} reviews." if product.rating else ""),
            recommendation="Consider your specific needs and compare with similar products before making a decision."
        )
    
    def chat(self, message: str, product_context: Optional[Dict[str, Any]] = None, 
                   history: List[ChatMessage] = []) -> tuple[str, List[str]]:
        """Handle chat messages about products"""
        if not self.is_available():
            return self._fallback_chat(message, product_context)
        
        try:
            system_prompt = """You are ProdAI, a helpful AI shopping assistant. You help users:
1. Understand product features and specifications
2. Compare products and make informed decisions
3. Find the best deals and alternatives
4. Answer questions about e-commerce and shopping

Be concise, helpful, and honest. If you don't know something, say so.
At the end of your response, suggest 2-3 follow-up questions the user might want to ask."""

            if product_context:
                system_prompt += f"\n\nCurrent product context:\n{product_context}"
            
            messages = [{"role": "system", "content": system_prompt}]
            
            # Add conversation history
            for msg in history[-5:]:  # Last 5 messages for context
                messages.append({"role": msg.role, "content": msg.content})
            
            messages.append({"role": "user", "content": message})
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            
            content = response.choices[0].message.content
            
            # Extract suggestions from response
            suggestions = []
            lines = content.split('\n')
            main_response = []
            in_suggestions = False
            
            for line in lines:
                if any(keyword in line.lower() for keyword in ['follow-up', 'you might ask', 'questions:', 'want to know']):
                    in_suggestions = True
                    continue
                if in_suggestions and line.strip().startswith(('-', '•', '*', '1', '2', '3')):
                    suggestion = line.strip().lstrip('-•*123456789. ')
                    if suggestion and len(suggestion) > 5:
                        suggestions.append(suggestion)
                else:
                    main_response.append(line)
            
            if not suggestions:
                suggestions = [
                    "What are the alternatives?",
                    "Is this product worth the price?",
                    "What should I look for in this category?"
                ]
            
            return '\n'.join(main_response).strip(), suggestions[:3]
            
        except Exception as e:
            print(f"Chat error: {e}")
            return self._fallback_chat(message, product_context)
    
    def _fallback_chat(self, message: str, product_context: Optional[Dict[str, Any]] = None) -> tuple[str, List[str]]:
        """Fallback chat responses when AI is not available"""
        message_lower = message.lower()
        
        if product_context:
            product_name = product_context.get('title', 'this product')
            price = product_context.get('price', 'N/A')
            
            if any(word in message_lower for word in ['price', 'cost', 'expensive', 'cheap']):
                return (
                    f"The current price of {product_name} is ₹{price}. I recommend comparing prices across different platforms to ensure you get the best deal.",
                    ["Is there a discount available?", "What are cheaper alternatives?", "Is this price good?"]
                )
            
            if any(word in message_lower for word in ['good', 'worth', 'buy', 'recommend']):
                return (
                    f"Whether {product_name} is worth buying depends on your specific needs and budget. Consider the specifications, read customer reviews, and compare with alternatives before making a decision.",
                    ["What are the pros and cons?", "What alternatives exist?", "What do reviews say?"]
                )
        
        if any(word in message_lower for word in ['hello', 'hi', 'hey']):
            return (
                "Hello! I'm ProdAI, your AI shopping assistant. Paste a product link and I can help you analyze it, compare prices, and make better shopping decisions!",
                ["How do I analyze a product?", "Can you compare products?", "What features do you have?"]
            )
        
        return (
            "I'm here to help you with product analysis and shopping decisions. Paste a product link from Amazon or Flipkart, and I can extract details, compare prices, and provide AI-powered insights!",
            ["How do I get started?", "What platforms do you support?", "Can you help me find products?"]
        )
    
    def compare_products(self, products: List[ProductDetails]) -> str:
        """Generate AI comparison of multiple products"""
        if not self.is_available():
            return self._fallback_comparison(products)
        
        try:
            products_text = ""
            for i, p in enumerate(products, 1):
                products_text += f"""
Product {i}: {p.title}
- Price: ₹{p.prices[0].price if p.prices else 'N/A'}
- Rating: {p.rating}/5 ({p.review_count} reviews)
- Brand: {p.brand or 'Unknown'}
- Key specs: {', '.join([f"{s.name}: {s.value}" for s in p.specifications[:5]])}
"""
            
            prompt = f"""Compare these products and provide a helpful analysis:

{products_text}

Provide:
1. A brief comparison of key differences
2. Which product is better for different use cases
3. Your recommendation and why"""

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a product comparison expert. Provide concise, helpful comparisons."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=600
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Comparison error: {e}")
            return self._fallback_comparison(products)
    
    def _fallback_comparison(self, products: List[ProductDetails]) -> str:
        """Fallback comparison when AI is not available"""
        if len(products) < 2:
            return "Need at least 2 products to compare."
        
        comparison = "## Product Comparison\n\n"
        
        # Find best price
        prices = [(p.title, p.prices[0].price if p.prices else float('inf')) for p in products]
        best_price = min(prices, key=lambda x: x[1])
        
        # Find best rating
        ratings = [(p.title, p.rating or 0) for p in products]
        best_rating = max(ratings, key=lambda x: x[1])
        
        comparison += f"**Best Price:** {best_price[0]} (₹{best_price[1]})\n"
        comparison += f"**Highest Rated:** {best_rating[0]} ({best_rating[1]}/5)\n\n"
        
        comparison += "Consider your priorities - if budget is key, go with the cheaper option. If quality matters more, consider the higher-rated product."
        
        return comparison
    
    def get_recommendations(self, query: str, category: Optional[str] = None,
                                   budget_min: Optional[float] = None, 
                                   budget_max: Optional[float] = None) -> List[Dict[str, str]]:
        """Get AI-powered product recommendations"""
        if not self.is_available():
            return self._fallback_recommendations(query)
        
        try:
            budget_text = ""
            if budget_min or budget_max:
                budget_text = f" Budget: ₹{budget_min or 0} - ₹{budget_max or 'any'}"
            
            prompt = f"""Based on this query, suggest 3-4 product recommendations:

Query: {query}
Category: {category or 'Any'}
{budget_text}

For each recommendation, provide:
1. Product type/name
2. Brief description
3. Estimated price range in INR
4. Why it's recommended
5. Search query to find it

Format as JSON array only, no other text:
[{{"title": "", "description": "", "estimated_price_range": "", "why_recommended": "", "search_query": ""}}]"""

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a shopping recommendation expert. Provide helpful product suggestions. Respond only with valid JSON, no markdown."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=600
            )
            
            import json
            content = response.choices[0].message.content
            
            try:
                recommendations = json.loads(content)
            except json.JSONDecodeError:
                import re
                json_match = re.search(r'\[[\s\S]*\]', content)
                if json_match:
                    recommendations = json.loads(json_match.group())
                else:
                    return self._fallback_recommendations(query)
            
            return recommendations
            
        except Exception as e:
            print(f"Recommendations error: {e}")
            return self._fallback_recommendations(query)
    
    def _fallback_recommendations(self, query: str) -> List[Dict[str, str]]:
        """Fallback recommendations when AI is not available"""
        return [
            {
                "title": f"Top-rated {query}",
                "description": f"Search for highly-rated {query} products with good reviews",
                "estimated_price_range": "Varies",
                "why_recommended": "Products with high ratings usually offer better quality",
                "search_query": f"best {query} 2024"
            },
            {
                "title": f"Budget {query}",
                "description": f"Affordable options for {query} with good value",
                "estimated_price_range": "Budget-friendly",
                "why_recommended": "Get the best value for your money",
                "search_query": f"budget {query} best value"
            },
            {
                "title": f"Premium {query}",
                "description": f"High-end {query} options with premium features",
                "estimated_price_range": "Premium",
                "why_recommended": "For those who want the best features and quality",
                "search_query": f"premium {query} top features"
            }
        ]


# Create singleton instance
ai_service = AIService()
