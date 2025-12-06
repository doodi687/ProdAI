import { motion } from 'framer-motion';
import { BarChart3, Trophy, Star, IndianRupee } from 'lucide-react';

export default function ComparisonTable({ comparison }) {
  if (!comparison || !comparison.comparison_table) return null;

  const { comparison_table, winner, ai_analysis, recommendation } = comparison;
  const headers = Object.keys(comparison_table);
  const productCount = comparison_table[headers[0]]?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Comparison Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Side-by-Side Comparison</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-800/50">
                <th className="px-5 py-4 text-left text-sm font-semibold text-dark-300">Feature</th>
                {Array.from({ length: productCount }).map((_, i) => (
                  <th key={i} className="px-5 py-4 text-left text-sm font-semibold text-white">
                    Product {i + 1}
                    {comparison_table.Title?.[i] === winner && (
                      <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                        <Trophy className="w-3 h-3" />
                        Winner
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {headers.map((header, rowIndex) => (
                <motion.tr
                  key={header}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * rowIndex }}
                  className={`border-t border-white/5 ${rowIndex % 2 === 0 ? 'bg-dark-800/20' : ''}`}
                >
                  <td className="px-5 py-4 text-sm font-medium text-dark-300">
                    {header}
                  </td>
                  {comparison_table[header].map((value, colIndex) => (
                    <td key={colIndex} className="px-5 py-4 text-sm text-white">
                      {header === 'Price' ? (
                        <span className="price-tag">
                          {value}
                        </span>
                      ) : header === 'Rating' ? (
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          {value}
                        </span>
                      ) : (
                        value
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Analysis */}
      {ai_analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
            AI Analysis
          </h4>
          <p className="text-dark-200 leading-relaxed whitespace-pre-line">{ai_analysis}</p>
        </motion.div>
      )}

      {/* Winner & Recommendation */}
      {(winner || recommendation) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
        >
          {winner && (
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-dark-300">Our Pick</p>
                <p className="text-xl font-bold text-white">{winner}</p>
              </div>
            </div>
          )}
          {recommendation && (
            <p className="text-dark-200">{recommendation}</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
