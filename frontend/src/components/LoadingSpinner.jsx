import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className={`${sizes[size]} rounded-full border-2 border-primary-500/20`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Inner spinning gradient */}
        <motion.div
          className={`absolute inset-0 ${sizes[size]} rounded-full`}
          style={{
            background: 'conic-gradient(from 0deg, transparent, #0ea5e9, #d946ef, transparent)',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-dark-300 text-sm"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="glass rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-dark-700" />
      <div className="p-5 space-y-4">
        <div className="h-6 bg-dark-700 rounded w-3/4" />
        <div className="h-4 bg-dark-700 rounded w-1/2" />
        <div className="flex items-center gap-3">
          <div className="h-8 bg-dark-700 rounded w-24" />
          <div className="h-4 bg-dark-700 rounded w-16" />
        </div>
        <div className="h-10 bg-dark-700 rounded" />
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}
