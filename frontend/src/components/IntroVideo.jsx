import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroVideo = ({ onComplete }) => {
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    // Check if intro has been shown in this session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    
    if (hasSeenIntro) {
      setShowVideo(false);
      onComplete();
      return;
    }

    // Auto-complete after 7 seconds as fallback
    const timer = setTimeout(() => {
      handleVideoEnd();
    }, 7500);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoEnd = () => {
    sessionStorage.setItem('hasSeenIntro', 'true');
    setShowVideo(false);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const handleVideoError = () => {
    console.log('Video failed to load, skipping intro');
    handleVideoEnd();
  };

  if (!showVideo) return null;

  return (
    <AnimatePresence>
      {showVideo && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            onError={handleVideoError}
            className="w-full h-full object-cover"
          >
            <source src="/intro.mp4" type="video/mp4" />
          </video>
          
          {/* Skip button */}
          <button
            onClick={handleVideoEnd}
            className="absolute bottom-8 right-8 px-4 py-2 bg-white/10 hover:bg-white/20 
                       text-white rounded-lg backdrop-blur-sm transition-all duration-300
                       border border-white/20 text-sm font-medium"
          >
            Skip Intro →
          </button>
          
          {/* Loading indicator */}
          <div className="absolute bottom-8 left-8 flex items-center gap-2 text-white/60 text-sm">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            <span>ProdAI</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroVideo;
