import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Lightbulb, Target } from 'lucide-react';

export default function ProsConsCard({ analysis }) {
  if (!analysis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl p-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">AI Analysis</h3>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-xl bg-dark-800/50 border border-dark-700">
        <p className="text-dark-200 leading-relaxed">{analysis.summary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pros */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-green-400" />
            <h4 className="font-semibold text-green-400">Pros</h4>
          </div>
          <ul className="space-y-2">
            {analysis.pros?.map((pro, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
              >
                <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-400 text-sm">✓</span>
                </span>
                <span className="text-sm text-dark-200">{pro}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ThumbsDown className="w-5 h-5 text-red-400" />
            <h4 className="font-semibold text-red-400">Cons</h4>
          </div>
          <ul className="space-y-2">
            {analysis.cons?.map((con, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
              >
                <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 text-sm">✗</span>
                </span>
                <span className="text-sm text-dark-200">{con}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendation */}
      {analysis.recommendation && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20">
          <Target className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-medium text-primary-400 mb-1">Recommendation</h5>
            <p className="text-sm text-dark-200">{analysis.recommendation}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
