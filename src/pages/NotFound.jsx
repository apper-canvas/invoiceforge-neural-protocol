import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Icons
const AlertTriangleIcon = getIcon('AlertTriangle');
const HomeIcon = getIcon('Home');

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 text-center"
    >
      <div className="w-24 h-24 mb-6 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 rounded-full">
        <AlertTriangleIcon className="h-12 w-12 text-amber-500" />
      </div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl font-bold mb-2"
      >
        404
      </motion.h1>
      
      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold mb-4"
      >
        Page Not Found
      </motion.h2>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-surface-600 dark:text-surface-400 max-w-md mb-8"
      >
        The page you are looking for doesn't exist or has been moved.
      </motion.p>
      
      <motion.button 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={() => navigate('/')}
        className="btn btn-primary flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <HomeIcon className="h-5 w-5" />
        Back to Home
      </motion.button>
    </motion.div>
  );
};

export default NotFound;