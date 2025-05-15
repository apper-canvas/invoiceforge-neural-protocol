import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import getIcon from '../utils/iconUtils';
import { fetchDashboardStatistics } from '../services/dashboardService';
import AIAssistantMessage from '../components/AIAssistantMessage';
import { fetchInvoices } from '../services/invoiceService';

// Icons
const FileInvoiceIcon = getIcon('FileText');
const DollarIcon = getIcon('DollarSign');
const ClockIcon = getIcon('Clock');
const CheckIcon = getIcon('CheckCircle');
const PlusIcon = getIcon('Plus');
const ChartIcon = getIcon('PieChart');
const UsersIcon = getIcon('Users');
const ArrowRightIcon = getIcon('ArrowRight');
const ArrowUpIcon = getIcon('ArrowUp');
const ArrowDownIcon = getIcon('ArrowDown');

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalRevenue: 0,
    outstanding: 0,
    paid: 0,
    pendingInvoices: 0,
    totalInvoices: 0,
    revenueChange: 0
  });
  
  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch statistics
        const statistics = await fetchDashboardStatistics();
        setSummaryData(statistics);
        
        // Fetch recent invoices (limit to 5)
        const { invoices } = await fetchInvoices(1, 5);
        setRecentInvoices(invoices);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Handle refresh
  const handleRefresh = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const statistics = await fetchDashboardStatistics();
      setSummaryData(statistics);
      
      // Fetch recent invoices (limit to 5)
      const { invoices } = await fetchInvoices(1, 5);
      setRecentInvoices(invoices);
      
      setLoading(false);
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
      setError("Failed to refresh dashboard data. Please try again.");
      setLoading(false);
    }
  };
  
  // If there's an error, display it
  if (error) {
    return (
      <div className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        </div>
        
        <AIAssistantMessage />
      </div>
    );
  }
  
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  
  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-surface-600 dark:text-surface-400">Welcome back! Here's an overview of your invoices</p>
      </div>
      
      {/* AI Assistant Message */}
      <AIAssistantMessage />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
      >
        <motion.div variants={itemVariants} className="dashboard-card">
          <div className="flex justify-between mb-3">
            <h3 className="text-surface-600 dark:text-surface-400 font-medium">Total Revenue</h3>
            <div className="flex items-center text-green-500 text-sm">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              {summaryData.revenueChange}%
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
              <DollarIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(summaryData.totalRevenue)}</p>
              <p className="text-xs text-surface-500 dark:text-surface-400">Total from {summaryData.totalInvoices} invoices</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="dashboard-card">
          <div className="flex justify-between mb-3">
            <h3 className="text-surface-600 dark:text-surface-400 font-medium">Outstanding</h3>
          </div>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center mr-3">
              <ClockIcon className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(summaryData.outstanding)}</p>
              <p className="text-xs text-surface-500 dark:text-surface-400">From {summaryData.pendingInvoices} pending invoices</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="dashboard-card">
          <div className="flex justify-between mb-3">
            <h3 className="text-surface-600 dark:text-surface-400 font-medium">Paid Invoices</h3>
          </div>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center mr-3">
              <CheckIcon className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(summaryData.paid)}</p>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                {(summaryData.totalInvoices - summaryData.pendingInvoices)} of {summaryData.totalInvoices} invoices
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Invoices</h2>
              <Link to="/invoices" className="text-primary text-sm font-medium flex items-center hover:underline">
                View All
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map(invoice => (
                    <tr key={invoice.Id}>
                      <td>{invoice.invoiceNumber}</td>
                      <td>{invoice.clientName}</td>
                      <td>{formatCurrency(invoice.amount)}</td>
                      <td>{formatDate(invoice.date)}</td>
                      <td>
                        <span className={`status-badge ${
                          invoice.status === 'paid' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400'
                        }`}>
                          {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="dashboard-card h-full">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/invoices/new" className="flex items-center p-3 rounded-lg bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-150">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                    <PlusIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Create Invoice</p>
                    <p className="text-xs text-surface-600 dark:text-surface-400">Add a new invoice</p>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/clients" className="flex items-center p-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700/50 transition-colors duration-150">
                  <div className="h-8 w-8 rounded-lg bg-surface-200 dark:bg-surface-700 flex items-center justify-center mr-3">
                    <UsersIcon className="h-4 w-4 text-surface-700 dark:text-surface-300" />
                  </div>
                  <div>
                    <p className="font-medium">Manage Clients</p>
                    <p className="text-xs text-surface-600 dark:text-surface-400">View and edit client information</p>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/reports" className="flex items-center p-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700/50 transition-colors duration-150">
                  <div className="h-8 w-8 rounded-lg bg-surface-200 dark:bg-surface-700 flex items-center justify-center mr-3">
                    <ChartIcon className="h-4 w-4 text-surface-700 dark:text-surface-300" />
                  </div>
                  <div>
                    <p className="font-medium">View Reports</p>
                    <p className="text-xs text-surface-600 dark:text-surface-400">Analyze your invoice data</p>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;