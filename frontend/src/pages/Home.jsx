import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  BarChart3, 
  MessageCircle, 
  Sparkles, 
  Zap, 
  Shield, 
  TrendingUp,
  ArrowRight,
  Star,
  Package
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Product Analyzer',
    description: 'Paste any product link and get instant details, specifications, and pricing.',
    color: 'from-blue-500 to-cyan-500',
    link: '/analyze'
  },
  {
    icon: BarChart3,
    title: 'Price Comparison',
    description: 'Compare prices across Amazon, Flipkart, and other platforms.',
    color: 'from-green-500 to-emerald-500',
    link: '/compare'
  },
  {
    icon: Sparkles,
    title: 'AI Analysis',
    description: 'Get smart pros & cons analysis powered by artificial intelligence.',
    color: 'from-purple-500 to-pink-500',
    link: '/analyze'
  },
  {
    icon: MessageCircle,
    title: 'Chat Assistant',
    description: 'Ask questions like "Is this better than iPhone 14?" and get instant answers.',
    color: 'from-orange-500 to-red-500',
    link: '/chat'
  }
];

const stats = [
  { value: '10K+', label: 'Products Analyzed' },
  { value: '50+', label: 'E-commerce Sites' },
  { value: '99%', label: 'Accuracy Rate' },
  { value: '24/7', label: 'AI Available' },
];

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8"
          >
            <Zap className="w-4 h-4" />
            AI-Powered Shopping Assistant
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold font-display mb-6"
          >
            <span className="text-white">Shop Smarter with</span>
            <br />
            <span className="gradient-text">ProdAI</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-dark-300 max-w-2xl mx-auto mb-10"
          >
            Your intelligent shopping companion. Compare prices, analyze features, 
            and make informed decisions with AI-powered insights.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/analyze" className="btn-primary flex items-center gap-2 text-lg">
              <Search className="w-5 h-5" />
              Analyze Product
            </Link>
            <Link to="/compare" className="btn-secondary flex items-center gap-2 text-lg">
              <BarChart3 className="w-5 h-5" />
              Compare Prices
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-dark-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-dark-500 flex items-start justify-center pt-2"
          >
            <div className="w-1 h-2 bg-primary-500 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-dark-300 max-w-2xl mx-auto">
              Everything you need to make smart shopping decisions, powered by AI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={feature.link} className="block">
                    <div className="glass rounded-2xl p-6 h-full card-hover group">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-dark-400 text-sm">
                        {feature.description}
                      </p>
                      <div className="mt-4 flex items-center text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Try it now <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
              How It Works
            </h2>
            <p className="text-dark-300 max-w-2xl mx-auto">
              Three simple steps to smarter shopping
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Paste Product Link',
                description: 'Copy any product URL from Amazon, Flipkart, or other e-commerce sites.',
                icon: Package
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI extracts details, compares prices, and analyzes features.',
                icon: Sparkles
              },
              {
                step: '03',
                title: 'Make Decision',
                description: 'Get clear pros & cons and recommendations to make the best choice.',
                icon: TrendingUp
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="glass rounded-2xl p-8 h-full text-center">
                  <div className="text-5xl font-bold text-primary-500/20 mb-4">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mx-auto mb-4 border border-primary-500/30">
                    <item.icon className="w-7 h-7 text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-dark-400">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-dark-600">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
                Ready to Shop Smarter?
              </h2>
              <p className="text-dark-300 mb-8 max-w-xl mx-auto">
                Start analyzing products and making better shopping decisions today. 
                It's free and takes just seconds.
              </p>
              <Link to="/analyze" className="btn-primary inline-flex items-center gap-2 text-lg">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
