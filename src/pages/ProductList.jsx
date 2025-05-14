import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { fetchProducts, createProduct, updateProduct } from '../services/productService';
import { setProducts, setLoading, setError, setTotalCount, setCurrentPage } from '../store/productSlice';

// Icons
const PlusIcon = getIcon('Plus');
const SearchIcon = getIcon('Search');
const EditIcon = getIcon('Edit');
const XIcon = getIcon('X');
const SaveIcon = getIcon('Save');

const ProductList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    Name: '',
    description: '',
    price: 0
  });

  const dispatch = useDispatch();
  const { products, loading, totalCount, currentPage } = useSelector(state => state.products);
  const PAGE_SIZE = 10;

  useEffect(() => {
    loadProducts();
  }, [dispatch, currentPage, searchQuery]);

  const loadProducts = async () => {
    try {
      dispatch(setLoading(true));
      const result = await fetchProducts(currentPage, PAGE_SIZE, searchQuery);
      dispatch(setProducts(result.products));
      dispatch(setTotalCount(result.totalCount));
      dispatch(setLoading(false));
    } catch (error) {
      console.error('Error loading products:', error);
      dispatch(setError('Failed to load products. Please try again.'));
      dispatch(setLoading(false));
      toast.error('Failed to load products');
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setCurrentPage(1));
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      Name: '',
      description: '',
      price: 0
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductFormData({
      Id: product.Id,
      Name: product.Name,
      description: product.description,
      price: product.price
    });
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductFormData({
      ...productFormData,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    try {
      if (!productFormData.Name) {
        toast.error('Product name is required');
        return;
      }

      dispatch(setLoading(true));

      if (editingProduct) {
        // Update existing product
        await updateProduct(productFormData);
        toast.success('Product updated successfully');
      } else {
        // Create new product
        await createProduct(productFormData);
        toast.success('Product added successfully');
      }

      // Reload products
      await loadProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
      dispatch(setLoading(false));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Products</h1>
            <p className="text-surface-600 dark:text-surface-400">Manage your products and services</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={handleAddProduct}
              className="btn btn-primary flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Product
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
                placeholder="Search products..."
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
                <th>Description</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">No products found</td>
                </tr>
              ) : products.map(product => (
                <tr key={product.Id}>
                  <td>{product.Name}</td>
                  <td className="whitespace-normal max-w-xs">{product.description}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 text-surface-500 hover:text-primary"
                        onClick={() => handleEditProduct(product)}
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
              Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} products
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

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-surface-800 rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button 
                className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                onClick={handleCloseModal}
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitProduct}>
              <div className="mb-4">
                <label className="label" htmlFor="Name">Product Name</label>
                <input
                  type="text"
                  id="Name"
                  name="Name"
                  className="input"
                  value={productFormData.Name}
                  onChange={handleProductFormChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="label" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="input resize-none h-24"
                  value={productFormData.description}
                  onChange={handleProductFormChange}
                />
              </div>
              
              <div className="mb-6">
                <label className="label" htmlFor="price">Price</label>
                <div className="relative">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="input pl-8"
                    value={productFormData.price}
                    onChange={handleProductFormChange}
                    min="0"
                    step="0.01"
                    required
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500">$</span>
                </div>
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
                  {loading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;