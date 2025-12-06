import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Sparkles, Bot, User, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { chatApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const suggestedQuestions = [
  "What should I look for when buying a smartphone?",
  "Is it better to buy from Amazon or Flipkart?",
  "How do I know if a product is genuine?",
  "What are the best budget laptops under 50000?",
];

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I'm ProdAI, your AI shopping assistant. I can help you with product questions, comparisons, and shopping advice. What would you like to know?",
      suggestions: suggestedQuestions.slice(0, 3)
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Check AI status on mount
    chatApi.getStatus()
      .then(res => setAiStatus(res.data))
      .catch(() => setAiStatus({ available: false }));
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim() || isTyping) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatApi.sendMessage(
        messageText,
        null, // product context
        messages.filter(m => m.role !== 'suggestions').slice(-10)
      );

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        suggestions: response.data.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      toast.error('Failed to get response');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        suggestions: []
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "👋 Chat cleared! How can I help you with your shopping today?",
        suggestions: suggestedQuestions.slice(0, 3)
      }
    ]);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
            <MessageCircle className="w-4 h-4" />
            AI Chat Assistant
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
            Chat with ProdAI
          </h1>
          <p className="text-dark-300 max-w-xl mx-auto">
            Ask me anything about products, prices, or shopping advice. 
            I'm here to help you make smarter decisions!
          </p>
          
          {/* AI Status */}
          {aiStatus && (
            <div className={`inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full text-xs font-medium
              ${aiStatus.available 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${aiStatus.available ? 'bg-green-500' : 'bg-yellow-500'}`} />
              {aiStatus.available ? 'AI Powered' : 'Basic Mode (Set API key for full features)'}
            </div>
          )}
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl overflow-hidden flex flex-col"
          style={{ height: 'calc(100vh - 350px)', minHeight: '500px' }}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">ProdAI Assistant</h3>
                <p className="text-xs text-dark-400">
                  {isTyping ? 'Typing...' : 'Online'}
                </p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
              title="Clear chat"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                    ${message.role === 'user' 
                      ? 'bg-primary-500/20' 
                      : 'bg-gradient-to-br from-primary-500 to-accent-500'
                    }`}
                  >
                    {message.role === 'user' 
                      ? <User className="w-5 h-5 text-primary-400" />
                      : <Sparkles className="w-5 h-5 text-white" />
                    }
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-4 rounded-2xl text-left
                      ${message.role === 'user'
                        ? 'bg-primary-500/20 text-white rounded-tr-sm'
                        : 'bg-dark-800/50 text-dark-100 rounded-tl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1.5 rounded-full bg-dark-800/50 text-dark-300 text-sm hover:bg-dark-800 hover:text-primary-400 transition-colors border border-dark-700 hover:border-primary-500/50"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-dark-800/50 rounded-2xl rounded-tl-sm p-4">
                    <div className="flex gap-1.5">
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 rounded-full bg-primary-400"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 rounded-full bg-primary-400"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 rounded-full bg-primary-400"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about products..."
                className="flex-1 px-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="btn-primary !px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTyping ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
