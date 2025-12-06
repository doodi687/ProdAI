"""
Product Scraping Service
Extracts product information from various e-commerce platforms
"""

import httpx
from bs4 import BeautifulSoup
from typing import Optional, Dict, Any, List
import re
from urllib.parse import urlparse
from fake_useragent import UserAgent
from models import ProductDetails, ProductPrice, ProductSpecification, Platform
from datetime import datetime
import asyncio
from cachetools import TTLCache

# Cache for product data (1 hour TTL)
product_cache = TTLCache(maxsize=100, ttl=3600)

class ProductScraper:
    def __init__(self):
        self.ua = UserAgent()
        self.timeout = 30.0
        
    def _get_headers(self) -> Dict[str, str]:
        """Generate random headers to avoid detection"""
        return {
            "User-Agent": self.ua.random,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
        }
    
    def detect_platform(self, url: str) -> Platform:
        """Detect e-commerce platform from URL"""
        domain = urlparse(url).netloc.lower()
        if "amazon" in domain:
            return Platform.AMAZON
        elif "flipkart" in domain:
            return Platform.FLIPKART
        return Platform.UNKNOWN
    
    async def fetch_page(self, url: str) -> Optional[str]:
        """Fetch page content"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True) as client:
                response = await client.get(url, headers=self._get_headers())
                if response.status_code == 200:
                    return response.text
                print(f"Failed to fetch {url}: Status {response.status_code}")
                return None
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    async def scrape_amazon(self, url: str, html: str) -> Optional[ProductDetails]:
        """Scrape Amazon product page"""
        try:
            soup = BeautifulSoup(html, 'lxml')
            
            # Title
            title_elem = soup.select_one('#productTitle')
            title = title_elem.get_text(strip=True) if title_elem else "Unknown Product"
            
            # Price
            price = 0.0
            original_price = None
            price_elem = soup.select_one('.a-price-whole')
            if price_elem:
                price_text = price_elem.get_text(strip=True).replace(',', '').replace('.', '')
                try:
                    price = float(price_text)
                except ValueError:
                    pass
            
            # Original price (if discounted)
            original_elem = soup.select_one('.a-text-price .a-offscreen')
            if original_elem:
                orig_text = original_elem.get_text(strip=True).replace('₹', '').replace(',', '')
                try:
                    original_price = float(orig_text)
                except ValueError:
                    pass
            
            # Image
            image_url = None
            img_elem = soup.select_one('#landingImage, #imgBlkFront')
            if img_elem:
                image_url = img_elem.get('data-old-hires') or img_elem.get('src')
            
            # Rating
            rating = None
            rating_elem = soup.select_one('.a-icon-star-small .a-icon-alt, #acrPopover')
            if rating_elem:
                rating_text = rating_elem.get_text(strip=True) if rating_elem.string else rating_elem.get('title', '')
                match = re.search(r'(\d+\.?\d*)', rating_text)
                if match:
                    rating = float(match.group(1))
            
            # Review count
            review_count = None
            review_elem = soup.select_one('#acrCustomerReviewText')
            if review_elem:
                review_text = review_elem.get_text(strip=True)
                match = re.search(r'([\d,]+)', review_text)
                if match:
                    review_count = int(match.group(1).replace(',', ''))
            
            # Brand
            brand = None
            brand_elem = soup.select_one('#bylineInfo, .po-brand .po-break-word')
            if brand_elem:
                brand = brand_elem.get_text(strip=True).replace('Visit the ', '').replace(' Store', '').replace('Brand: ', '')
            
            # Description
            description = None
            desc_elem = soup.select_one('#productDescription p, #feature-bullets')
            if desc_elem:
                description = desc_elem.get_text(strip=True)[:500]
            
            # Specifications
            specifications = []
            spec_table = soup.select('#productDetails_techSpec_section_1 tr, .a-normal.a-spacing-micro tr')
            for row in spec_table[:15]:
                cells = row.select('th, td')
                if len(cells) >= 2:
                    name = cells[0].get_text(strip=True)
                    value = cells[1].get_text(strip=True)
                    if name and value:
                        specifications.append(ProductSpecification(name=name, value=value))
            
            # Feature bullets as specs
            bullets = soup.select('#feature-bullets li span.a-list-item')
            for i, bullet in enumerate(bullets[:5]):
                text = bullet.get_text(strip=True)
                if text and len(text) > 10:
                    specifications.append(ProductSpecification(name=f"Feature {i+1}", value=text[:200]))
            
            # Calculate discount
            discount = None
            if original_price and price and original_price > price:
                discount = round(((original_price - price) / original_price) * 100, 1)
            
            prices = [ProductPrice(
                platform="Amazon",
                price=price,
                original_price=original_price,
                discount_percentage=discount,
                url=url,
                in_stock=True
            )]
            
            return ProductDetails(
                title=title,
                description=description,
                brand=brand,
                category="Electronics",  # Would need AI to categorize
                image_url=image_url,
                images=[image_url] if image_url else [],
                rating=rating,
                review_count=review_count,
                specifications=specifications,
                prices=prices,
                platform="Amazon",
                url=url
            )
            
        except Exception as e:
            print(f"Error parsing Amazon page: {e}")
            return None
    
    async def scrape_flipkart(self, url: str, html: str) -> Optional[ProductDetails]:
        """Scrape Flipkart product page"""
        try:
            soup = BeautifulSoup(html, 'lxml')
            
            # Title
            title_elem = soup.select_one('.VU-ZEz, h1.yhB1nd span')
            title = title_elem.get_text(strip=True) if title_elem else "Unknown Product"
            
            # Price
            price = 0.0
            price_elem = soup.select_one('.Nx9bqj.CxhGGd, ._30jeq3._16Jk6d')
            if price_elem:
                price_text = price_elem.get_text(strip=True).replace('₹', '').replace(',', '')
                try:
                    price = float(price_text)
                except ValueError:
                    pass
            
            # Original price
            original_price = None
            original_elem = soup.select_one('.yRaY8j.A6+E6v, ._3I9_wc._2p6lqe')
            if original_elem:
                orig_text = original_elem.get_text(strip=True).replace('₹', '').replace(',', '')
                try:
                    original_price = float(orig_text)
                except ValueError:
                    pass
            
            # Image
            image_url = None
            img_elem = soup.select_one('img._396cs4, img._2r_T1I')
            if img_elem:
                image_url = img_elem.get('src')
            
            # Rating
            rating = None
            rating_elem = soup.select_one('.XQDdHH, ._3LWZlK')
            if rating_elem:
                try:
                    rating = float(rating_elem.get_text(strip=True))
                except ValueError:
                    pass
            
            # Review count
            review_count = None
            review_elem = soup.select_one('.Wphh3N span:nth-child(2), ._2_R_DZ span')
            if review_elem:
                review_text = review_elem.get_text(strip=True)
                match = re.search(r'([\d,]+)\s*Review', review_text, re.I)
                if match:
                    review_count = int(match.group(1).replace(',', ''))
            
            # Description
            description = None
            desc_elem = soup.select_one('._1mXcCf.RmoJUa, .RmoJUa')
            if desc_elem:
                description = desc_elem.get_text(strip=True)[:500]
            
            # Specifications
            specifications = []
            spec_rows = soup.select('._14cfVK tr, .WuYr3E tr')
            for row in spec_rows[:15]:
                cells = row.select('td')
                if len(cells) >= 2:
                    name = cells[0].get_text(strip=True)
                    value = cells[1].get_text(strip=True)
                    if name and value:
                        specifications.append(ProductSpecification(name=name, value=value))
            
            # Highlights
            highlights = soup.select('._21Ahn- li, .xFVion li')
            for i, hl in enumerate(highlights[:5]):
                text = hl.get_text(strip=True)
                if text:
                    specifications.append(ProductSpecification(name=f"Highlight {i+1}", value=text[:200]))
            
            # Calculate discount
            discount = None
            if original_price and price and original_price > price:
                discount = round(((original_price - price) / original_price) * 100, 1)
            
            prices = [ProductPrice(
                platform="Flipkart",
                price=price,
                original_price=original_price,
                discount_percentage=discount,
                url=url,
                in_stock=True
            )]
            
            return ProductDetails(
                title=title,
                description=description,
                brand=None,
                category="Electronics",
                image_url=image_url,
                images=[image_url] if image_url else [],
                rating=rating,
                review_count=review_count,
                specifications=specifications,
                prices=prices,
                platform="Flipkart",
                url=url
            )
            
        except Exception as e:
            print(f"Error parsing Flipkart page: {e}")
            return None
    
    async def scrape_product(self, url: str) -> Optional[ProductDetails]:
        """Main method to scrape product from URL"""
        # Check cache first
        cache_key = url
        if cache_key in product_cache:
            return product_cache[cache_key]
        
        platform = self.detect_platform(url)
        html = await self.fetch_page(url)
        
        if not html:
            return None
        
        product = None
        if platform == Platform.AMAZON:
            product = await self.scrape_amazon(url, html)
        elif platform == Platform.FLIPKART:
            product = await self.scrape_flipkart(url, html)
        else:
            # Try to extract basic info for unknown platforms
            product = await self._scrape_generic(url, html)
        
        if product:
            product_cache[cache_key] = product
        
        return product
    
    async def _scrape_generic(self, url: str, html: str) -> Optional[ProductDetails]:
        """Generic scraper for unknown platforms"""
        try:
            soup = BeautifulSoup(html, 'lxml')
            
            # Try common title selectors
            title = None
            for selector in ['h1', '[itemprop="name"]', '.product-title', '.product-name']:
                elem = soup.select_one(selector)
                if elem:
                    title = elem.get_text(strip=True)
                    break
            
            if not title:
                title = "Unknown Product"
            
            # Try to find price
            price = 0.0
            for selector in ['[itemprop="price"]', '.price', '.product-price']:
                elem = soup.select_one(selector)
                if elem:
                    price_text = elem.get_text(strip=True)
                    match = re.search(r'[\d,]+\.?\d*', price_text.replace(',', ''))
                    if match:
                        try:
                            price = float(match.group())
                        except ValueError:
                            pass
                    break
            
            # Image
            image_url = None
            for selector in ['[itemprop="image"]', '.product-image img', 'img']:
                elem = soup.select_one(selector)
                if elem:
                    image_url = elem.get('src') or elem.get('data-src')
                    break
            
            domain = urlparse(url).netloc
            
            return ProductDetails(
                title=title,
                description=None,
                brand=None,
                category=None,
                image_url=image_url,
                images=[image_url] if image_url else [],
                rating=None,
                review_count=None,
                specifications=[],
                prices=[ProductPrice(
                    platform=domain,
                    price=price,
                    url=url
                )],
                platform=domain,
                url=url
            )
        except Exception as e:
            print(f"Error in generic scraper: {e}")
            return None


# Create singleton instance
scraper = ProductScraper()
