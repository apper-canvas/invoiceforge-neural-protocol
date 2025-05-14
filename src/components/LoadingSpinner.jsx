import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', fullScreen = false }) => {
  // Size configuration
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  const spinnerClass = `${sizeClasses[size]} rounded-full border-t-primary border-r-primary border-b-primary/30 border-l-primary/30 animate-spin`;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-surface-900/80 flex items-center justify-center z-50">
        <motion.div
          className={spinnerClass}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return <div className={spinnerClass} />;
};

export default LoadingSpinner;