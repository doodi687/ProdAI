import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Search, 
  TrendingUp, 
  ArrowRight, 
  ExternalLink,
  IndianRupee,
  Star,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { recommendationsApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = [
  { id: 'all', label: 'All', icon: '🔍' },
  { id: 'smartphones', label: 'Smartphones', icon: '📱' },
  { id: 'laptops', label: 'Laptops', icon: '💻' },
  { id: 'headphones', label: 'Headphones', icon: '🎧' },
  { id: 'watches', label: 'Watches', icon: '⌚' },
  { id: 'cameras', label: 'Cameras', icon: '📷' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
];

export default function Recommendations() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [trending, setTrending] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Load trending on mount
    recommendationsApi.getTrending()
      .then(res => setTrending(res.data))
      .catch(console.error);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter what you\'re looking for');
      return;
    }

    setIsLoading(true);

    try {
      const response = await recommendationsApi.suggest(
        query,
        category !== 'all' ? category : null,
        budgetMin ? parseFloat(budgetMin) : null,
        budgetMax ? parseFloat(budgetMax) : null
      );
      setRecommendations(response.data);
      toast.success('Recommendations found!');
    } catch (err) {
      console.error('Recommendations error:', err);
      toast.error('Failed to get recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemo = async () => {
    setIsLoading(true);
    try {
      const response = await recommendationsApi.getDemo();
      setRecommendations(response.data);
      toast.success('Demo recommendations loaded!');
    } catch (err) {
      toast.error('Failed to load demo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrendingClick = (searchTerm) => {
    setQuery(searchTerm);
    // Auto-submit
    setIsLoading(true);
    recommendationsApi.suggest(searchTerm)
      .then(res => {
        setRecommendations(res.data);
        toast.success('Recommendations found!');
      })
      .catch(() => toast.error('Failed to get recommendations'))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Smart Recommendations
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
            Discover Products
          </h1>
          <p className="text-dark-300 max-w-xl mx-auto">
            Tell us what you're looking for and get AI-powered recommendations 
            tailored to your needs and budget.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <form onSubmit={handleSearch} className="glass rounded-2xl p-6">
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for? (e.g., 'best phone for photography')"
                className="w-full pl-12 pr-4 py-4 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${category === cat.id
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-dark-800/50 text-dark-300 border border-dark-700 hover:border-dark-500'
                    }`}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Filters Toggle */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-dark-400 hover:text-primary-400 transition-colors flex items-center gap-2 mb-4"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide' : 'Show'} Budget Filter
            </button>

            {/* Budget Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-4 mb-4 overflow-hidden"
                >
                  <div>
                    <label className="text-sm text-dark-400 mb-1 block">Min Budget (₹)</label>
                    <input
                      type="number"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-dark-400 mb-1 block">Max Budget (₹)</label>
                    <input
                      type="number"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      placeholder="No limit"
                      className="w-full px-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Get Recommendations
                </>
              )}
            </button>
          </form>

          {/* Demo Button */}
          <div className="text-center mt-4">
            <button
              onClick={loadDemo}
              disabled={isLoading}
              className="text-sm text-dark-400 hover:text-primary-400 transition-colors"
            >
              Or see demo recommendations →
            </button>
          </div>
        </motion.div>

        {/* Trending Section */}
        {!recommendations && trending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-400" />
              Trending Searches
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trending.popular_searches?.map((search, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => handleTrendingClick(search)}
                  className="glass rounded-xl p-4 text-left hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white group-hover:text-primary-400 transition-colors">
                      {search}
                    </span>
                    <ArrowRight className="w-4 h-4 text-dark-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Trending Categories */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Popular Categories</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {trending.trending_categories?.map((cat, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => {
                      setCategory(cat.name.toLowerCase());
                      setQuery(cat.name);
                    }}
                    className="glass rounded-xl p-4 text-center hover:bg-white/5 transition-colors group"
                  >
                    <span className="text-3xl mb-2 block">{cat.icon}</span>
                    <span className="text-sm text-white font-medium">{cat.name}</span>
                    <span className="text-xs text-dark-400 block mt-1">
                      {cat.searches?.toLocaleString()} searches
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <LoadingSpinner size="lg" />
              <p className="mt-6 text-dark-300 text-center">
                Finding the best products for you...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommendations Results */}
        <AnimatePresence>
          {recommendations && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-400" />
                  Recommended for You
                </h2>
                <button
                  onClick={() => setRecommendations(null)}
                  className="text-sm text-dark-400 hover:text-primary-400 transition-colors"
                >
                  Clear results
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.recommendations?.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="glass rounded-2xl p-6 card-hover"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {rec.title}
                    </h3>
                    <p className="text-dark-300 text-sm mb-4">
                      {rec.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <IndianRupee className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">
                        {rec.estimated_price_range}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-primary-500/10 border border-primary-500/20 mb-4">
                      <p className="text-sm text-primary-300">
                        <Star className="w-4 h-4 inline mr-1" />
                        {rec.why_recommended}
                      </p>
                    </div>

                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(rec.search_query)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-primary-400 font-medium border border-primary-500/30 hover:border-primary-500/50 transition-all"
                    >
                      <Search className="w-4 h-4" />
                      Search Online
                    </a>
                  </motion.div>
                ))}
              </div>

              {/* Search Tips */}
              {recommendations.search_tips && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass rounded-2xl p-6"
                >
                  <h3 className="font-semibold text-white mb-4">💡 Shopping Tips</h3>
                  <ul className="space-y-2">
                    {recommendations.search_tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-dark-300 text-sm">
                        <span className="text-primary-400 mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
