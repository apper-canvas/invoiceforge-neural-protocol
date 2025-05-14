import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Layout
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InvoiceList from './pages/InvoiceList';
import ClientList from './pages/ClientList';
import ProductList from './pages/ProductList';
import Reports from './pages/Reports';

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
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <AnimatePresence mode="wait">
          <Routes>  
            <Route path="/" element={<Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}>
              <Route index element={<Dashboard />} />
              <Route path="invoices" element={<InvoiceList />} />
              <Route path="invoices/new" element={<Home />} />
              <Route path="clients" element={<ClientList />} />
              <Route path="products" element={<ProductList />} />
              <Route path="reports" element={<Reports />} />
            </Route>  
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