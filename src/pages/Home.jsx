import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
      toast.success("Create a new invoice", { icon: "📝" });
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <motion.div className="p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <MainFeature />
    </motion.div>
  );
};

export default Home;