import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import SidebarNav from './SidebarNav';

// Icons
const MenuIcon = getIcon('Menu');
const MoonIcon = getIcon('Moon');
const SunIcon = getIcon('Sun');
const BellIcon = getIcon('Bell');
const UserIcon = getIcon('User');
const FileInvoiceIcon = getIcon('FileText');

const Layout = ({ darkMode, toggleDarkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (sidebarOpen && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [sidebarOpen]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-surface-50 dark:bg-surface-900">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'} lg:sidebar-expanded`}>
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center mb-6 px-2">
            <div className="h-10 w-10 bg-primary rounded flex items-center justify-center mr-3">
              <FileInvoiceIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-primary">InvoiceForge</h1>
          </div>
          
          <SidebarNav closeSidebar={() => setSidebarOpen(false)} />
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 content-with-sidebar">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center h-16 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 px-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 lg:hidden"
          >
            <MenuIcon className="h-6 w-6 text-surface-700 dark:text-surface-300" />
          </button>
          
          <div className="ml-auto flex items-center space-x-3">
            <button 
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 relative"
            >
              <BellIcon className="h-5 w-5 text-surface-700 dark:text-surface-300" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></span>
            </button>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-amber-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-primary" />
              )}
            </button>
            
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700">
              <div className="h-8 w-8 bg-surface-200 dark:bg-surface-600 rounded-full flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-surface-700 dark:text-surface-300" />
              </div>
            </button>
          </div>
        </header>
        
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;