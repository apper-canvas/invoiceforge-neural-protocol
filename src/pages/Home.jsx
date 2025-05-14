import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

// Icons
const FileInvoiceIcon = getIcon('FileText');
const UsersIcon = getIcon('Users');
const ChartBarIcon = getIcon('BarChart');
const InboxIcon = getIcon('Inbox');
const ArrowRightIcon = getIcon('ArrowRight');

const Home = () => {
  const [showDemo, setShowDemo] = useState(false);
  
  const handleStartDemoClick = () => {
    setShowDemo(true);
    toast.success("Welcome to InvoiceForge! Let's create your first invoice.", {
      icon: "🚀"
    });
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <div className="min-h-screen">
      {!showDemo ? (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <header className="mb-16 text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-4"
            >
              <div className="h-16 w-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg mb-2">
                <FileInvoiceIcon className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark"
            >
              InvoiceForge
            </motion.h1>
            
            <motion.p 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-surface-700 dark:text-surface-300 max-w-2xl mx-auto"
            >
              Create, manage, and send professional invoices with ease. Streamline your billing workflow and get paid faster.
            </motion.p>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8"
            >
              <button 
                onClick={handleStartDemoClick}
                className="btn btn-primary px-8 py-3 text-lg rounded-xl shadow-lg flex items-center gap-2 group mx-auto"
              >
                Start Creating Invoices
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </header>
          
          <motion.section 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            <motion.div variants={childVariants} className="card p-6 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-card hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <FileInvoiceIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Professional Invoices</h3>
              <p className="text-surface-600 dark:text-surface-400">Create customizable, branded invoices that reflect your business identity and impress your clients.</p>
            </motion.div>
            
            <motion.div variants={childVariants} className="card p-6 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-card hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-secondary/10 dark:bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                <UsersIcon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Client Management</h3>
              <p className="text-surface-600 dark:text-surface-400">Organize your client information, track payment history, and manage client-specific pricing all in one place.</p>
            </motion.div>
            
            <motion.div variants={childVariants} className="card p-6 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-card hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-accent/10 dark:bg-accent/20 rounded-xl flex items-center justify-center mb-4">
                <ChartBarIcon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Financial Insights</h3>
              <p className="text-surface-600 dark:text-surface-400">Track payments, monitor outstanding invoices, and gain valuable insights into your business finances.</p>
            </motion.div>
          </motion.section>
          
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-8">Ready to streamline your invoicing process?</h2>
            <button 
              onClick={handleStartDemoClick}
              className="btn neu-shadow-light dark:neu-shadow-dark bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 px-8 py-3 rounded-xl text-lg font-medium transition-all duration-300"
            >
              Try InvoiceForge Now
            </button>
          </motion.div>
        </div>
      ) : (
        <MainFeature />
      )}
    </div>
  );
};

export default Home;