import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import getIcon from '../utils/iconUtils';
import { fetchInvoices } from '../services/invoiceService';
import { setInvoices, setLoading, setError, setTotalCount, setCurrentPage } from '../store/invoiceSlice';

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
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  
  const dispatch = useDispatch();
  const { invoices, totalCount, currentPage } = useSelector(state => state.invoices);
  const PAGE_SIZE = 10;
  
  
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        dispatch(setLoading(true));
        const result = await fetchInvoices(currentPage, PAGE_SIZE, searchQuery, statusFilter);
        dispatch(setInvoices(result.invoices));
        dispatch(setTotalCount(result.totalCount));
        dispatch(setLoading(false));
        setLoading(false);
      } catch (error) {
        console.error('Error loading invoices:', error);
        dispatch(setError('Failed to load invoices. Please try again.'));
        dispatch(setLoading(false));
        setLoading(false);
        toast.error('Failed to load invoices');
      }
    };

    loadInvoices();
  }, [dispatch, currentPage, searchQuery, statusFilter]);
  
  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setCurrentPage(1));
  };

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
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search invoices or clients..."
                className="input pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-500" />
            </form>
          </div>
          
          <div>
            <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
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
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">Loading invoices...</td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">No invoices found</td>
                </tr>
              ) : invoices.map(invoice => (
                <tr key={invoice.Id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.clientName}</td>
                  <td>{formatDate(invoice.date)}</td>
                  <td>{formatDate(invoice.dueDate)}</td>
                  <td>{formatCurrency(invoice.amount)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(invoice.status)}`}>
                      {(invoice.status || 'pending').charAt(0).toUpperCase() + (invoice.status || 'pending').slice(1)}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1 text-surface-500 hover:text-primary">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <Link to={`/invoices/edit/${invoice.Id}`} className="p-1 text-surface-500 hover:text-primary">
                        <EditIcon className="h-4 w-4" />
                      </Link>
                      <button 
                        className="p-1 text-surface-500 hover:text-red-500"
                        onClick={() => {
                          setInvoiceToDelete(invoice);
                          setShowDeleteModal(true);
                        }}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalCount > PAGE_SIZE && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-surface-600 dark:text-surface-400">
              Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} invoices
            </div>
            <div className="flex gap-2">
              <button 
                className="btn btn-outline py-1 px-3" 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              <span className="btn py-1 px-3 bg-surface-100 dark:bg-surface-700">
                {currentPage}
              </span>
              <button 
                className="btn btn-outline py-1 px-3" 
                disabled={currentPage * PAGE_SIZE >= totalCount}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;