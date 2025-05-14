import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { fetchClients, createClient, updateClient } from '../services/clientService';
import { setClients, setLoading, setError, setTotalCount, setCurrentPage } from '../store/clientSlice';

// Icons
const PlusIcon = getIcon('Plus');
const SearchIcon = getIcon('Search');
const EditIcon = getIcon('Edit');
const TrashIcon = getIcon('Trash');
const XIcon = getIcon('X');
const SaveIcon = getIcon('Save');

const ClientList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientFormData, setClientFormData] = useState({
    Name: '',
    email: '',
    address: ''
  });

  const dispatch = useDispatch();
  const { clients, loading, totalCount, currentPage } = useSelector(state => state.clients);
  const PAGE_SIZE = 10;

  useEffect(() => {
    loadClients();
  }, [dispatch, currentPage, searchQuery]);

  const loadClients = async () => {
    try {
      dispatch(setLoading(true));
      const result = await fetchClients(currentPage, PAGE_SIZE, searchQuery);
      dispatch(setClients(result.clients));
      dispatch(setTotalCount(result.totalCount));
      dispatch(setLoading(false));
    } catch (error) {
      console.error('Error loading clients:', error);
      dispatch(setError('Failed to load clients. Please try again.'));
      dispatch(setLoading(false));
      toast.error('Failed to load clients');
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setCurrentPage(1));
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setClientFormData({
      Name: '',
      email: '',
      address: ''
    });
    setShowClientModal(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setClientFormData({
      Id: client.Id,
      Name: client.Name,
      email: client.email,
      address: client.address
    });
    setShowClientModal(true);
  };

  const handleCloseModal = () => {
    setShowClientModal(false);
    setEditingClient(null);
  };

  const handleClientFormChange = (e) => {
    const { name, value } = e.target;
    setClientFormData({
      ...clientFormData,
      [name]: value
    });
  };

  const handleSubmitClient = async (e) => {
    e.preventDefault();

    try {
      if (!clientFormData.Name) {
        toast.error('Client name is required');
        return;
      }

      if (!clientFormData.email) {
        toast.error('Client email is required');
        return;
      }

      dispatch(setLoading(true));

      if (editingClient) {
        // Update existing client
        await updateClient(clientFormData);
        toast.success('Client updated successfully');
      } else {
        // Create new client
        await createClient(clientFormData);
        toast.success('Client added successfully');
      }

      // Reload clients
      await loadClients();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error('Failed to save client');
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Clients</h1>
            <p className="text-surface-600 dark:text-surface-400">Manage your client information</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={handleAddClient}
              className="btn btn-primary flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Client
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-card mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search clients..."
                className="input pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-500" />
            </form>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">Loading clients...</td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">No clients found</td>
                </tr>
              ) : clients.map(client => (
                <tr key={client.Id}>
                  <td>{client.Name}</td>
                  <td>{client.email}</td>
                  <td className="whitespace-normal max-w-xs">{client.address}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 text-surface-500 hover:text-primary"
                        onClick={() => handleEditClient(client)}
                      >
                        <EditIcon className="h-4 w-4" />
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
              Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} clients
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

      {/* Client Modal */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-surface-800 rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingClient ? 'Edit Client' : 'Add Client'}</h2>
              <button 
                className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                onClick={handleCloseModal}
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitClient}>
              <div className="mb-4">
                <label className="label" htmlFor="Name">Client Name</label>
                <input
                  type="text"
                  id="Name"
                  name="Name"
                  className="input"
                  value={clientFormData.Name}
                  onChange={handleClientFormChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="label" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input"
                  value={clientFormData.email}
                  onChange={handleClientFormChange}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="label" htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  className="input resize-none h-24"
                  value={clientFormData.address}
                  onChange={handleClientFormChange}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-2"
                  disabled={loading}
                >
                  <SaveIcon className="h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
  );
};

export default ClientList;