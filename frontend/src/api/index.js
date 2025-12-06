import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 second timeout for scraping operations
});

// Products API
export const productsApi = {
  analyze: (url) => api.post('/api/products/analyze', { url }),
  getProsCons: (url) => api.post('/api/products/pros-cons', { url }),
  analyzeFull: (url) => api.post('/api/products/analyze-full', { url }),
  getDemo: () => api.get('/api/products/demo'),
};

// Chat API
export const chatApi = {
  sendMessage: (message, productContext = null, conversationHistory = []) => 
    api.post('/api/chat/message', { 
      message, 
      product_context: productContext,
      conversation_history: conversationHistory 
    }),
  getStatus: () => api.get('/api/chat/status'),
};

// Compare API
export const compareApi = {
  compareProducts: (productUrls) => 
    api.post('/api/compare/products', { products: productUrls }),
  getDemo: () => api.get('/api/compare/demo'),
};

// Recommendations API
export const recommendationsApi = {
  suggest: (query, category = null, budgetMin = null, budgetMax = null) =>
    api.post('/api/recommendations/suggest', { 
      query, 
      category,
      budget_min: budgetMin,
      budget_max: budgetMax 
    }),
  getTrending: () => api.get('/api/recommendations/trending'),
  getDemo: () => api.get('/api/recommendations/demo'),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
