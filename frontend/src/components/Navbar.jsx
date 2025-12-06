import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Search, 
  BarChart3, 
  MessageCircle, 
  Sparkles,
  Home
} from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/analyze', label: 'Analyze', icon: Search },
  { path: '/compare', label: 'Compare', icon: BarChart3 },
  { path: '/chat', label: 'AI Chat', icon: MessageCircle },
  { path: '/recommendations', label: 'Discover', icon: Sparkles },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold font-display">
              <span className="gradient-text">Prod</span>
              <span className="text-white">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2
                    ${isActive 
                      ? 'text-white' 
                      : 'text-dark-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-lg border border-primary-500/30"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-white border border-primary-500/30' 
                        : 'text-dark-300 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
