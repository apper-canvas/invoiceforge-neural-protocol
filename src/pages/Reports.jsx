import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchInvoices } from '../services/invoiceService';
import { fetchClients } from '../services/clientService';
import InvoiceSummaryReport from '../components/InvoiceSummaryReport';
import Chart from 'react-apexcharts';
import getIcon from '../utils/iconUtils';

// Icons
const ChartIcon = getIcon('PieChart');
const RevenueIcon = getIcon('DollarSign');
const ClientIcon = getIcon('Users');
const RefreshIcon = getIcon('RefreshCw');

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('month'); // 'month', 'quarter', 'year'

  // Fetch data on component mount
  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      
      // Fetch all invoices for reporting
      const invoiceResult = await fetchInvoices(1, 1000); // Get up to 1000 invoices for reporting
      setInvoices(invoiceResult.invoices || []);
      
      // Fetch client data
      const clientResult = await fetchClients(1, 1000);
      setClients(clientResult.clients || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading report data:', error);
      setError('Failed to load report data');
      setLoading(false);
    }
  };

  // Prepare data for status distribution chart
  const getStatusChartData = () => {
    const statusCounts = {
      paid: 0,
      pending: 0,
      overdue: 0
    };
    
    invoices.forEach(invoice => {
      if (statusCounts.hasOwnProperty(invoice.status)) {
        statusCounts[invoice.status]++;
      } else {
        statusCounts.pending++; // Default to pending if status is undefined
      }
    });
    
    return {
      series: Object.values(statusCounts),
      options: {
        labels: Object.keys(statusCounts).map(status => 
          status.charAt(0).toUpperCase() + status.slice(1)
        ),
        colors: ['#10B981', '#F59E0B', '#EF4444'],
        legend: {
          show: true,
          position: 'bottom'
        },
        chart: {
          foreColor: document.documentElement.classList.contains('dark') ? '#CBD5E1' : '#475569',
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      }
    };
  };

  // Prepare data for monthly revenue chart
  const getRevenueChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenue = Array(12).fill(0);
    
    invoices.forEach(invoice => {
      const invoiceDate = new Date(invoice.date);
      const month = invoiceDate.getMonth();
      monthlyRevenue[month] += parseFloat(invoice.total) || 0;
    });
    
    return {
      series: [{
        name: 'Revenue',
        data: monthlyRevenue
      }],
      options: {
        chart: {
          type: 'bar',
          height: 350,
          foreColor: document.documentElement.classList.contains('dark') ? '#CBD5E1' : '#475569',
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: months,
        },
        yaxis: {
          title: {
            text: 'Revenue (USD)'
          }
        },
        colors: ['#8B5CF6'],
        tooltip: {
          y: {
            formatter: function (val) {
              return "$" + val.toFixed(2);
            }
          }
        }
      }
    };
  };

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Reports</h1>
          <p className="text-surface-600 dark:text-surface-400">Analyze your invoice data and performance</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button 
            onClick={loadReportData}
            className="btn btn-outline flex items-center gap-2"
            >
            <RefreshIcon className="h-4 w-4" />
            Refresh Data
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 dark:text-red-400">{error}</div>
      ) : (
        <div className="space-y-6">
          {/* Invoice Summary Report */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InvoiceSummaryReport />
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ChartIcon className="h-5 w-5 text-primary mr-2" />
              Invoice Status Distribution
            </h3>
            <div className="h-80">
              <Chart 
                options={getStatusChartData().options} 
                series={getStatusChartData().series} 
                type="pie" 
                height="100%" 
              />
            </div>
          </div>
          
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <RevenueIcon className="h-5 w-5 text-primary mr-2" />
              Monthly Revenue
            </h3>
            <div className="h-80">
              <Chart 
                options={getRevenueChartData().options} 
                series={getRevenueChartData().series} 
                type="bar" 
                height="100%" 
              />
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Reports;