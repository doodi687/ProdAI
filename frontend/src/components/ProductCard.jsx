import { motion } from 'framer-motion';
import { Star, ExternalLink, TrendingDown, Package } from 'lucide-react';

export default function ProductCard({ product, analysis, showAnalysis = false }) {
  if (!product) return null;

  const mainPrice = product.prices?.[0];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden card-hover"
    >
      {/* Product Image */}
      <div className="relative h-48 bg-dark-800 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-dark-500" />
          </div>
        )}
        
        {/* Discount Badge */}
        {mainPrice?.discount_percentage > 0 && (
          <div className="absolute top-3 left-3 discount-badge">
            <TrendingDown className="w-3 h-3 mr-1" />
            {mainPrice.discount_percentage.toFixed(0)}% OFF
          </div>
        )}
        
        {/* Platform Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-dark-900/80 text-xs font-medium text-dark-200">
          {product.platform}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-white line-clamp-2 leading-tight">
          {product.title}
        </h3>

        {/* Brand & Rating */}
        <div className="flex items-center justify-between">
          {product.brand && (
            <span className="text-sm text-dark-400">by {product.brand}</span>
          )}
          
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-white">{product.rating}</span>
              {product.review_count && (
                <span className="text-xs text-dark-400">
                  ({product.review_count.toLocaleString()})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-white">
            ₹{mainPrice?.price?.toLocaleString() || 'N/A'}
          </span>
          {mainPrice?.original_price && mainPrice.original_price > mainPrice.price && (
            <span className="text-sm text-dark-400 line-through">
              ₹{mainPrice.original_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${mainPrice?.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-dark-300">
            {mainPrice?.in_stock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* View Button */}
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-primary-400 font-medium border border-primary-500/30 hover:border-primary-500/50 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          View on {product.platform}
        </a>
      </div>

      {/* Analysis Section */}
      {showAnalysis && analysis && (
        <div className="border-t border-white/10 p-5 space-y-4">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
            AI Analysis
          </h4>
          
          <p className="text-sm text-dark-300">{analysis.summary}</p>

          {/* Pros */}
          <div>
            <h5 className="text-sm font-medium text-green-400 mb-2">Pros</h5>
            <ul className="space-y-1">
              {analysis.pros?.slice(0, 3).map((pro, i) => (
                <li key={i} className="text-xs text-dark-300 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div>
            <h5 className="text-sm font-medium text-red-400 mb-2">Cons</h5>
            <ul className="space-y-1">
              {analysis.cons?.slice(0, 3).map((con, i) => (
                <li key={i} className="text-xs text-dark-300 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
}
