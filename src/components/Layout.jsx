import React, { useState, useContext } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../App';
import { useSelector } from 'react-redux';
import getIcon from '../utils/iconUtils';

// Icons
const MenuIcon = getIcon('Menu');
const XIcon = getIcon('X');
const HomeIcon = getIcon('Home');
const FileInvoiceIcon = getIcon('FileText');
const UsersIcon = getIcon('Users');
const PackageIcon = getIcon('Package');
const ChartIcon = getIcon('PieChart');
const SettingsIcon = getIcon('Settings');
const LogoutIcon = getIcon('LogOut');
const SunIcon = getIcon('Sun');
const MoonIcon = getIcon('Moon');

const Layout = ({ darkMode, toggleDarkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const navigation = [
    { name: 'Dashboard', to: '/', icon: HomeIcon },
    { name: 'Invoices', to: '/invoices', icon: FileInvoiceIcon },
    { name: 'Clients', to: '/clients', icon: UsersIcon },
    { name: 'Products', to: '/products', icon: PackageIcon },
    { name: 'Reports', to: '/reports', icon: ChartIcon },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - mobile version (off-canvas) */}
      <aside 
        className={`sidebar ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'} lg:sidebar-expanded`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-6 px-1">
            <Link to="/" className="flex items-center space-x-3">
              <FileInvoiceIcon className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">InvoiceForge</span>
            </Link>
            <button
              type="button"
              className="lg:hidden text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50"
              onClick={toggleSidebar}
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* User info */}
          <div className="border-b border-surface-200 dark:border-surface-700 pb-4 mb-4">
            <div className="flex items-center px-1">
              <div className="flex-shrink-0">
                <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-primary rounded-full">
                  <span className="font-medium text-white">
                    {user?.firstName?.charAt(0) || user?.emailAddress?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.firstName || user?.emailAddress || 'User'}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 truncate max-w-[180px]">
                  {user?.emailAddress || ''}
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation Links */}
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  onClick={closeSidebar}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          
          {/* Bottom actions */}
          <div className="mt-auto pt-4 border-t border-surface-200 dark:border-surface-700 mt-6">
            <ul className="space-y-2">
              <li>
                <button 
                  className="nav-link w-full"
                  onClick={toggleDarkMode}
                >
                  {darkMode ? (
                    <>
                      <SunIcon className="h-5 w-5 mr-3" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <MoonIcon className="h-5 w-5 mr-3" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </li>
              <li>
                <button 
                  className="nav-link w-full"
                  onClick={handleLogout}
                >
                  <LogoutIcon className="h-5 w-5 mr-3" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full content-with-sidebar">
        {/* Top navigation for mobile/tablet */}
        <header className="bg-white dark:bg-surface-800 shadow-sm border-b border-surface-200 dark:border-surface-700 sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              type="button"
              className="lg:hidden text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50"
              onClick={toggleSidebar}
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            
            <div className="lg:hidden flex items-center space-x-1">
              <FileInvoiceIcon className="h-6 w-6 text-primary" />
              <span className="font-bold">InvoiceForge</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleDarkMode}
                className="p-2 text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;