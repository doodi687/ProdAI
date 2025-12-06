import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Plus, Trash2, Link as LinkIcon, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { compareApi } from '../api';
import ComparisonTable from '../components/ComparisonTable';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Compare() {
  const [urls, setUrls] = useState(['', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState(null);

  const addUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, '']);
    } else {
      toast.error('Maximum 5 products can be compared');
    }
  };

  const removeUrl = (index) => {
    if (urls.length > 2) {
      setUrls(urls.filter((_, i) => i !== index));
    } else {
      toast.error('Minimum 2 products required for comparison');
    }
  };

  const updateUrl = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleCompare = async (e) => {
    e.preventDefault();
    
    const validUrls = urls.filter(url => url.trim());
    
    if (validUrls.length < 2) {
      toast.error('Please enter at least 2 product URLs');
      return;
    }

    // Validate URLs
    for (const url of validUrls) {
      try {
        new URL(url);
      } catch {
        toast.error(`Invalid URL: ${url.substring(0, 30)}...`);
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setComparison(null);

    try {
      const response = await compareApi.compareProducts(validUrls);
      setComparison(response.data);
      toast.success('Products compared successfully!');
    } catch (err) {
      console.error('Comparison error:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to compare products. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemo = async () => {
    setIsLoading(true);
    setError(null);
    setComparison(null);

    try {
      const response = await compareApi.getDemo();
      setComparison(response.data);
      toast.success('Demo comparison loaded!');
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-6">
            <BarChart3 className="w-4 h-4" />
            Price Comparison
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
            Compare Products
          </h1>
          <p className="text-dark-300 max-w-xl mx-auto">
            Add product links from different platforms to compare prices, 
            specifications, and get AI-powered recommendations.
          </p>
        </motion.div>

        {/* URL Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <form onSubmit={handleCompare} className="glass rounded-2xl p-6">
            <div className="space-y-4 mb-6">
              {urls.map((url, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-3"
                >
                  <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-xs font-bold text-primary-400">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => updateUrl(index, e.target.value)}
                      placeholder={`Product ${index + 1} URL`}
                      className="w-full pl-14 pr-4 py-3.5 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeUrl(index)}
                    disabled={urls.length <= 2 || isLoading}
                    className="p-3.5 rounded-xl bg-dark-800 border border-dark-700 text-dark-400 hover:text-red-400 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Add More Button */}
            <button
              type="button"
              onClick={addUrl}
              disabled={urls.length >= 5 || isLoading}
              className="w-full py-3 rounded-xl border-2 border-dashed border-dark-600 text-dark-400 hover:border-primary-500/50 hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mb-6"
            >
              <Plus className="w-5 h-5" />
              Add Another Product ({urls.length}/5)
            </button>

            {/* Compare Button */}
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
                  Compare Products
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
              Or see a demo comparison →
            </button>
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
                Comparing products... This may take a moment.
              </p>
              <p className="text-sm text-dark-500 mt-2">
                Fetching data and generating AI analysis
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
                    <h3 className="font-semibold text-red-400 mb-2">Comparison Failed</h3>
                    <p className="text-dark-300 text-sm">{error}</p>
                    <p className="text-dark-500 text-sm mt-2">
                      Make sure all URLs are correct and the products are accessible.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {comparison && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Product Preview Cards */}
              {comparison.products && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {comparison.products.map((product, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass rounded-2xl overflow-hidden"
                    >
                      <div className="h-32 bg-dark-800 flex items-center justify-center">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="h-full w-full object-contain p-4"
                          />
                        ) : (
                          <LinkIcon className="w-12 h-12 text-dark-500" />
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-white text-sm line-clamp-2 mb-2">
                          {product.title}
                        </h4>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-green-400">
                            ₹{product.prices?.[0]?.price?.toLocaleString() || 'N/A'}
                          </span>
                          <span className="text-xs text-dark-400">{product.platform}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Comparison Table */}
              <ComparisonTable comparison={comparison} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
