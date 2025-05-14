import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Components
const MoonIcon = getIcon('Moon');
const SunIcon = getIcon('Sun');

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  
  return (
    <>
      <div className="min-h-screen">
        {/* Theme Toggle Button */}
        <motion.button
          onClick={toggleDarkMode}
          className="fixed bottom-4 right-4 z-50 p-2 rounded-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-md hover:shadow-lg hover:border-primary/30 dark:hover:border-primary-light/30 transition-all duration-300"
          whileHover={{ opacity: 0.9 }}
          whileTap={{ scale: 0.9 }}
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5 text-amber-400" />
          ) : (
            <MoonIcon className="h-5 w-5 text-primary" />
          )}
        </motion.button>
        
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </div>
      
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastStyle={{
          borderRadius: '4px',
        }}
      />
    </>
  );
}

export default App;