import { useState } from 'react';
import { motion } from 'framer-motion';

const AIAssistantMessage = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 p-4 border border-primary/20 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-primary dark:text-primary-light mb-1">AI Assistant Insights</h3>
          <p className="text-sm text-surface-700 dark:text-surface-300 mb-2">You have 2 overdue invoices totaling $3,250. Consider sending reminders to improve your cash flow.</p>
          <button 
            onClick={() => setIsVisible(false)} 
            className="text-xs text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
          >Dismiss</button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIAssistantMessage;