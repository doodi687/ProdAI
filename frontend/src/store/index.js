import { create } from 'zustand';

export const useProductStore = create((set) => ({
  // Current product being analyzed
  currentProduct: null,
  analysis: null,
  isLoading: false,
  error: null,
  
  // Actions
  setCurrentProduct: (product) => set({ currentProduct: product }),
  setAnalysis: (analysis) => set({ analysis }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ currentProduct: null, analysis: null, isLoading: false, error: null }),
}));

export const useChatStore = create((set) => ({
  messages: [],
  isTyping: false,
  productContext: null,
  
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setTyping: (isTyping) => set({ isTyping }),
  setProductContext: (context) => set({ productContext: context }),
  clearChat: () => set({ messages: [], productContext: null }),
}));

export const useCompareStore = create((set) => ({
  products: [],
  comparison: null,
  isLoading: false,
  
  setProducts: (products) => set({ products }),
  setComparison: (comparison) => set({ comparison }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ products: [], comparison: null, isLoading: false }),
}));
