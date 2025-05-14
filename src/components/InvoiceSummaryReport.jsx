import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchInvoiceSummaryData } from '../services/invoiceService';
import LoadingSpinner from './LoadingSpinner';
import getIcon from '../utils/iconUtils';

// Icons
const FileTextIcon = getIcon('FileText');
const DollarSignIcon = getIcon('DollarSign');
const ClockIcon = getIcon('Clock');
const CheckCircleIcon = getIcon('CheckCircle');
const AlertCircleIcon = getIcon('AlertCircle');
const TrendingUpIcon = getIcon('TrendingUp');
const RefreshCwIcon = getIcon('RefreshCw');

const InvoiceSummaryReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    averageInvoiceAmount: 0
  });

  const loadSummaryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { invoices } = await fetchInvoiceSummaryData();
      
      if (!invoices || invoices.length === 0) {
        setSummaryData({
          totalInvoices: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          overdueAmount: 0,
          averageInvoiceAmount: 0
        });
        setLoading(false);
        return;
      }

      // Calculate total amount
      const totalAmount = invoices.reduce((sum, invoice) => sum + (parseFloat(invoice.total) || 0), 0);
      
      // Calculate amounts by status
      const paidAmount = invoices
        .filter(invoice => invoice.status === 'paid')
        .reduce((sum, invoice) => sum + (parseFloat(invoice.total) || 0), 0);
      
      const pendingAmount = invoices
        .filter(invoice => invoice.status === 'pending')
        .reduce((sum, invoice) => sum + (parseFloat(invoice.total) || 0), 0);
      
      const overdueAmount = invoices
        .filter(invoice => invoice.status === 'overdue')
        .reduce((sum, invoice) => sum + (parseFloat(invoice.total) || 0), 0);
      
      // Calculate average invoice amount
      const averageInvoiceAmount = invoices.length > 0 ? totalAmount / invoices.length : 0;

      setSummaryData({
        totalInvoices: invoices.length,
        totalAmount,
        paidAmount,
        pendingAmount,
        overdueAmount,
        averageInvoiceAmount
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading invoice summary data:', error);
      setError('Failed to load invoice summary data');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummaryData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="dashboard-card flex items-center justify-center p-8">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card p-4">
        <div className="text-red-500 dark:text-red-400 flex items-center gap-2">
          <AlertCircleIcon className="w-5 h-5" />
          {error}
        </div>
        <button 
          onClick={loadSummaryData} 
          className="mt-4 btn btn-outline flex items-center gap-2"
        >
          <RefreshCwIcon className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-card p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FileTextIcon className="h-5 w-5 text-primary mr-2" />
          Invoice Summary Report
        </h3>
        <button 
          onClick={loadSummaryData}
          className="mt-2 md:mt-0 btn btn-outline text-sm flex items-center gap-1 py-1"
        >
          <RefreshCwIcon className="h-3 w-3" />
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-surface-50 dark:bg-surface-800/50 p-4 rounded-lg border border-surface-200 dark:border-surface-700">
          <div className="flex items-center mb-2">
            <DollarSignIcon className="h-5 w-5 text-primary mr-2" />
            <h4 className="text-surface-700 dark:text-surface-300 font-medium">Total Amount Due</h4>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(summaryData.totalAmount)}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Across {summaryData.totalInvoices} invoices</p>
        </div>
        
        <div className="bg-surface-50 dark:bg-surface-800/50 p-4 rounded-lg border border-surface-200 dark:border-surface-700">
          <div className="flex items-center mb-2">
            <TrendingUpIcon className="h-5 w-5 text-primary mr-2" />
            <h4 className="text-surface-700 dark:text-surface-300 font-medium">Average Invoice Value</h4>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(summaryData.averageInvoiceAmount)}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Per invoice</p>
        </div>
        
        <div className="bg-surface-50 dark:bg-surface-800/50 p-4 rounded-lg border border-surface-200 dark:border-surface-700">
          <div className="flex items-center mb-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <h4 className="text-surface-700 dark:text-surface-300 font-medium">Paid Amount</h4>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(summaryData.paidAmount)}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{(summaryData.paidAmount / (summaryData.totalAmount || 1) * 100).toFixed(1)}% of total</p>
        </div>

        <div className="bg-surface-50 dark:bg-surface-800/50 p-4 rounded-lg border border-surface-200 dark:border-surface-700">
          <div className="flex items-center mb-2">
            <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />
            <h4 className="text-surface-700 dark:text-surface-300 font-medium">Pending Amount</h4>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(summaryData.pendingAmount)}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{(summaryData.pendingAmount / (summaryData.totalAmount || 1) * 100).toFixed(1)}% of total</p>
        </div>
        
        <div className="bg-surface-50 dark:bg-surface-800/50 p-4 rounded-lg border border-surface-200 dark:border-surface-700">
          <div className="flex items-center mb-2">
            <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2" />
            <h4 className="text-surface-700 dark:text-surface-300 font-medium">Overdue Amount</h4>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(summaryData.overdueAmount)}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{(summaryData.overdueAmount / (summaryData.totalAmount || 1) * 100).toFixed(1)}% of total</p>
        </div>
        
        <div className="bg-surface-50 dark:bg-surface-800/50 p-4 rounded-lg border border-surface-200 dark:border-surface-700">
          <div className="flex items-center mb-2">
            <FileTextIcon className="h-5 w-5 text-blue-500 mr-2" />
            <h4 className="text-surface-700 dark:text-surface-300 font-medium">Total Invoices</h4>
          </div>
          <p className="text-2xl font-bold">{summaryData.totalInvoices}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            {summaryData.totalInvoices > 0 ? 'All invoice records' : 'No invoices found'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummaryReport;