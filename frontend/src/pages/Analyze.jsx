import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Link as LinkIcon, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../api';
import ProductCard from '../components/ProductCard';
import ProsConsCard from '../components/ProsConsCard';
import SpecificationsCard from '../components/SpecificationsCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Analyze() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter a product URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProduct(null);
    setAnalysis(null);

    try {
      const response = await productsApi.analyzeFull(url);
      setProduct(response.data.product);
      setAnalysis(response.data.analysis);
      toast.success('Product analyzed successfully!');
    } catch (err) {
      console.error('Analysis error:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to analyze product. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemo = async () => {
    setIsLoading(true);
    setError(null);
    setProduct(null);
    setAnalysis(null);

    try {
      const response = await productsApi.getDemo();
      setProduct(response.data.product);
      setAnalysis(response.data.analysis);
      toast.success('Demo product loaded!');
    } catch (err) {
      console.error('Demo error:', err);
      toast.error('Failed to load demo');
    } finally {
      setIsLoading(false);
    }
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
            <Search className="w-4 h-4" />
            Product Analyzer
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
            Analyze Any Product
          </h1>
          <p className="text-dark-300 max-w-xl mx-auto">
            Paste a product link from Amazon, Flipkart, or other e-commerce sites 
            to get detailed analysis, specs, and AI-powered insights.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <form onSubmit={handleAnalyze} className="relative">
            <div className="glass rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste product URL here (Amazon, Flipkart, etc.)"
                  className="w-full pl-12 pr-4 py-4 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center justify-center gap-2 min-w-[140px]"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Demo Button */}
          <div className="text-center mt-4">
            <button
              onClick={loadDemo}
              disabled={isLoading}
              className="text-sm text-dark-400 hover:text-primary-400 transition-colors"
            >
              Or try with a demo product →
            </button>
          </div>

          {/* Supported Platforms */}
          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-dark-500">
            <span>Supported:</span>
            <span className="px-2 py-1 rounded bg-dark-800 text-dark-300">Amazon</span>
            <span className="px-2 py-1 rounded bg-dark-800 text-dark-300">Flipkart</span>
            <span className="px-2 py-1 rounded bg-dark-800 text-dark-300">& more</span>
          </div>
        </motion.div>

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
                Analyzing product... This may take a few seconds.
              </p>
              <p className="text-sm text-dark-500 mt-2">
                Extracting details and generating AI insights
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="glass rounded-2xl p-6 border border-red-500/30 bg-red-500/10">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-400 mb-2">Analysis Failed</h3>
                    <p className="text-dark-300 text-sm">{error}</p>
                    <p className="text-dark-500 text-sm mt-2">
                      Make sure the URL is correct and the product page is accessible.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {product && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Product Overview */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Product Card */}
                <div className="lg:col-span-1">
                  <ProductCard product={product} />
                </div>

                {/* Pros & Cons */}
                <div className="lg:col-span-2">
                  <ProsConsCard analysis={analysis} />
                </div>
              </div>

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <SpecificationsCard specifications={product.specifications} />
              )}

              {/* Price Comparison */}
              {product.prices && product.prices.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
                    Prices
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.prices.map((price, index) => (
                      <a
                        key={index}
                        href={price.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-colors group"
                      >
                        <div>
                          <p className="font-medium text-white">{price.platform}</p>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xl font-bold text-green-400">
                              ₹{price.price?.toLocaleString()}
                            </span>
                            {price.discount_percentage > 0 && (
                              <span className="text-xs text-red-400">
                                -{price.discount_percentage.toFixed(0)}%
                              </span>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="w-5 h-5 text-dark-400 group-hover:text-primary-400 transition-colors" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
