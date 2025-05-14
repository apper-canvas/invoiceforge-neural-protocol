import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Icons
const PlusIcon = getIcon('Plus');
const SearchIcon = getIcon('Search');
const FilterIcon = getIcon('Filter');
const EditIcon = getIcon('Edit');
const EyeIcon = getIcon('Eye');
const TrashIcon = getIcon('Trash');

const InvoiceList = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample invoice data
  const invoices = [
    { id: 'INV-2023-042', client: 'Acme Corp', amount: 1250.00, date: '2023-03-15', status: 'paid', dueDate: '2023-04-15' },
    { id: 'INV-2023-041', client: 'Wayne Enterprises', amount: 875.50, date: '2023-03-12', status: 'pending', dueDate: '2023-04-12' },
    { id: 'INV-2023-040', client: 'Stark Industries', amount: 2340.00, date: '2023-03-10', status: 'pending', dueDate: '2023-04-10' },
    { id: 'INV-2023-039', client: 'Daily Planet', amount: 450.25, date: '2023-03-05', status: 'paid', dueDate: '2023-04-05' },
    { id: 'INV-2023-038', client: 'Umbrella Corp', amount: 1890.75, date: '2023-03-01', status: 'paid', dueDate: '2023-04-01' },
    { id: 'INV-2023-037', client: 'Globex Corporation', amount: 3200.00, date: '2023-02-25', status: 'overdue', dueDate: '2023-03-25' },
    { id: 'INV-2023-036', client: 'Initech', amount: 750.50, date: '2023-02-20', status: 'paid', dueDate: '2023-03-20' },
    { id: 'INV-2023-035', client: 'Massive Dynamic', amount: 1250.00, date: '2023-02-15', status: 'paid', dueDate: '2023-03-15' },
    { id: 'INV-2023-034', client: 'Cyberdyne Systems', amount: 4800.25, date: '2023-02-10', status: 'overdue', dueDate: '2023-03-10' },
    { id: 'INV-2023-033', client: 'Soylent Corp', amount: 920.75, date: '2023-02-05', status: 'paid', dueDate: '2023-03-05' },
  ];
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
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
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400';
      case 'pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400';
      default:
        return 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200';
    }
  };
  
  const filteredInvoices = invoices.filter(invoice => 
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.client.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Invoices</h1>
          <p className="text-surface-600 dark:text-surface-400">Manage and track all your invoices</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link to="/invoices/new" className="btn btn-primary flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Create Invoice
          </Link>
        </div>
      </div>
      
      <div className="dashboard-card mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search invoices or clients..."
              className="input pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-500" />
          </div>
          
          <button className="btn btn-outline flex items-center gap-2">
            <FilterIcon className="h-4 w-4" />
            Filters
          </button>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Client</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(invoice => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.client}</td>
                  <td>{formatDate(invoice.date)}</td>
                  <td>{formatDate(invoice.dueDate)}</td>
                  <td>{formatCurrency(invoice.amount)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1 text-surface-500 hover:text-primary">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-surface-500 hover:text-primary">
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-surface-500 hover:text-red-500">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;