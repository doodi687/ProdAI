import { Link } from 'react-router-dom';
import { Github, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-display">
                <span className="gradient-text">Prod</span>
                <span className="text-white">AI</span>
              </span>
            </Link>
            <p className="text-dark-400 text-sm max-w-md">
              AI-powered product comparison and shopping assistant. 
              Make smarter shopping decisions with intelligent price comparison, 
              feature analysis, and personalized recommendations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/analyze" className="text-dark-400 hover:text-primary-400 transition-colors">
                  Product Analyzer
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-dark-400 hover:text-primary-400 transition-colors">
                  Price Comparison
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-dark-400 hover:text-primary-400 transition-colors">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="text-dark-400 hover:text-primary-400 transition-colors">
                  Smart Recommendations
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Project</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-dark-400">
                Semester VII Project
              </li>
              <li className="text-dark-400">
                AI & Data Science
              </li>
              <li className="text-dark-400">
                Guided by Dr. Alok Singh Gehlot
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-dark-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-dark-400 text-sm">
            © 2024 ProdAI. All rights reserved.
          </p>
          <p className="text-dark-400 text-sm flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by Vishal Doodi & Dev Kumar Agarwal
          </p>
        </div>
      </div>
    </footer>
  );
}
