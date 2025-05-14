import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Icons
const FileInvoiceIcon = getIcon('FileText');
const PlusIcon = getIcon('Plus');
const TrashIcon = getIcon('Trash');
const SaveIcon = getIcon('Save');
const EyeIcon = getIcon('Eye');
const PrintIcon = getIcon('Printer');
const SendIcon = getIcon('Send');
const CalendarIcon = getIcon('Calendar');
const DollarSignIcon = getIcon('DollarSign');
const PercentIcon = getIcon('Percent');
const EditIcon = getIcon('Edit');
const CloseIcon = getIcon('X');
const BackIcon = getIcon('ArrowLeft');

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    invoiceNumber: generateInvoiceNumber(),
    date: formatDate(new Date()),
    dueDate: formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days from now
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    items: [{ id: 1, description: '', quantity: 1, price: 0, total: 0 }],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
    notes: '',
  });
  
  // Generate invoice number like INV-2023-001
  function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}-${random}`;
  }
  
  // Format date to YYYY-MM-DD
  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }
  
  // Calculate totals
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxAmount = subtotal * (formData.taxRate / 100);
    const total = subtotal + taxAmount;
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }));
  }, [formData.items, formData.taxRate]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle item changes
  const handleItemChange = (id, field, value) => {
    setFormData(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Auto-calculate item total if quantity or price changes
          if (field === 'quantity' || field === 'price') {
            updatedItem.total = updatedItem.quantity * updatedItem.price;
          }
          
          return updatedItem;
        }
        return item;
      });
      
      return { ...prev, items: updatedItems };
    });
  };
  
  // Add new item
  const addItem = () => {
    const newId = Math.max(0, ...formData.items.map(item => item.id)) + 1;
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: newId, description: '', quantity: 1, price: 0, total: 0 }]
    }));
  };
  
  // Remove item
  const removeItem = (id) => {
    if (formData.items.length === 1) {
      toast.error("You need at least one item on the invoice");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
    
    toast.info("Item removed");
  };
  
  // Save invoice
  const saveInvoice = () => {
    // Validate form
    if (!formData.clientName) {
      toast.error("Please enter client name");
      setActiveTab('details');
      return;
    }
    
    if (!formData.clientEmail) {
      toast.error("Please enter client email");
      setActiveTab('details');
      return;
    }
    
    // Check if any item has empty description
    const hasEmptyItems = formData.items.some(item => !item.description);
    if (hasEmptyItems) {
      toast.error("Please fill in all item descriptions");
      setActiveTab('items');
      return;
    }
    
    // In a real app, this would save to a database or API
    toast.success("Invoice saved successfully!");
    console.log("Invoice data:", formData);
  };
  
  // Send invoice
  const sendInvoice = () => {
    // Validate form first
    if (!formData.clientName || !formData.clientEmail) {
      toast.error("Please complete client details first");
      setActiveTab('details');
      return;
    }
    
    // In a real app, this would send the invoice via email
    toast.success(`Invoice sent to ${formData.clientEmail}`);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Tab variants for animation
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };
  
  return (
    <div className="w-full">
      {showPreview ? (
        <InvoicePreview formData={formData} onClose={() => setShowPreview(false)} />
      ) : (
        <>
          <header className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <FileInvoiceIcon className="h-8 w-8 text-primary mr-2" />
                <h1 className="text-xl md:text-2xl font-bold">Create New Invoice</h1>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setShowPreview(true)}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <EyeIcon className="h-4 w-4" />
                  Preview
                </button>
                <button 
                  onClick={saveInvoice}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <SaveIcon className="h-4 w-4" />
                  Save
                </button>
                <button 
                  onClick={sendInvoice}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <SendIcon className="h-4 w-4" />
                  Send
                </button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-surface-800 rounded p-1 flex mb-4 border border-surface-200 dark:border-surface-700 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('details')}
                className={`py-2 px-4 rounded-lg flex-1 font-medium text-sm transition-all ${
                  activeTab === 'details' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                Client Details
              </button>
              <button
                onClick={() => setActiveTab('items')}
                className={`py-2 px-4 rounded-lg flex-1 font-medium text-sm transition-all ${
                  activeTab === 'items' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                Items & Services
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`py-2 px-4 rounded-lg flex-1 font-medium text-sm transition-all ${
                  activeTab === 'summary' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                Summary
              </button>
            </div>
          </header>
          
          <div className="card">
            <AnimatePresence mode="wait">
              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-6">
                        <label className="label">Invoice Number</label>
                        <input 
                          type="text" 
                          name="invoiceNumber"
                          value={formData.invoiceNumber}
                          onChange={handleChange}
                          className="input"
                          disabled
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="label">Issue Date</label>
                          <div className="relative">
                            <input 
                              type="date" 
                              name="date"
                              value={formData.date}
                              onChange={handleChange}
                              className="input pl-10"
                            />
                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-500" />
                          </div>
                        </div>
                        <div>
                          <label className="label">Due Date</label>
                          <div className="relative">
                            <input 
                              type="date" 
                              name="dueDate"
                              value={formData.dueDate}
                              onChange={handleChange}
                              className="input pl-10"
                            />
                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-surface-50 dark:bg-surface-700/30 p-4 rounded border border-surface-200 dark:border-surface-600">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        Client Information
                      </h3>
                      
                      <div className="mb-4">
                        <label className="label">Client Name</label>
                        <input 
                          type="text" 
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleChange}
                          placeholder="Enter client name"
                          className="input"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="label">Client Email</label>
                        <input 
                          type="email" 
                          name="clientEmail"
                          value={formData.clientEmail}
                          onChange={handleChange}
                          placeholder="client@example.com"
                          className="input"
                        />
                      </div>
                      
                      <div>
                        <label className="label">Client Address</label>
                        <textarea 
                          name="clientAddress"
                          value={formData.clientAddress}
                          onChange={handleChange}
                          placeholder="Enter client address"
                          className="input resize-none h-20"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={() => setActiveTab('items')}
                      className="btn btn-primary"
                    >
                      Next: Add Items
                    </button>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'items' && (
                <motion.div
                  key="items"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full mb-6">
                      <thead>
                        <tr className="border-b border-surface-200 dark:border-surface-700">
                          <th className="text-left py-3 px-2">Description</th>
                          <th className="text-right py-3 px-2 w-24">Quantity</th>
                          <th className="text-right py-3 px-2 w-32">Price</th>
                          <th className="text-right py-3 px-2 w-32">Total</th>
                          <th className="w-16"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.items.map((item) => (
                          <tr key={item.id} className="border-b border-surface-200 dark:border-surface-700">
                            <td className="py-2 px-2">
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                placeholder="Item description"
                                className="input"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                min="1"
                                className="input text-right"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <div className="relative">
                                <input
                                  type="number"
                                  value={item.price}
                                  onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                                  min="0"
                                  step="0.01"
                                  className="input text-right pl-8"
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500">$</span>
                              </div>
                            </td>
                            <td className="py-2 px-2 text-right">
                              {formatCurrency(item.quantity * item.price)}
                            </td>
                            <td className="py-2 px-2 text-right">
                              <button 
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <button 
                    onClick={addItem}
                    className="flex items-center gap-2 text-primary hover:text-primary-dark mb-6"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Add Item
                  </button>
                  
                  <div className="mt-8 flex justify-between">
                    <button 
                      onClick={() => setActiveTab('details')}
                      className="btn btn-outline"
                    >
                      Back
                    </button>
                    <button 
                      onClick={() => setActiveTab('summary')}
                      className="btn btn-primary"
                    >
                      Next: Summary
                    </button>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'summary' && (
                <motion.div
                  key="summary"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Invoice Summary</h3>
                      
                      <div className="bg-surface-50 dark:bg-surface-700/30 p-4 rounded border border-surface-200 dark:border-surface-600">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-surface-700 dark:text-surface-300">Invoice Number:</span>
                          <span className="font-medium">{formData.invoiceNumber}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-surface-700 dark:text-surface-300">Issue Date:</span>
                          <span className="font-medium">{new Date(formData.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-surface-700 dark:text-surface-300">Due Date:</span>
                          <span className="font-medium">{new Date(formData.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="border-t border-surface-200 dark:border-surface-600 my-2 pt-2"></div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-surface-700 dark:text-surface-300">Client:</span>
                          <span className="font-medium">{formData.clientName || "Not provided"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-surface-700 dark:text-surface-300">Email:</span>
                          <span className="font-medium">{formData.clientEmail || "Not provided"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Payment Details</h3>
                      
                      <div className="bg-surface-50 dark:bg-surface-700/30 p-4 rounded border border-surface-200 dark:border-surface-600 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-surface-700 dark:text-surface-300">Subtotal:</span>
                          <span className="font-medium">{formatCurrency(formData.subtotal)}</span>
                        </div>
                        
                        <div className="flex items-center mb-2">
                          <span className="text-surface-700 dark:text-surface-300 mr-2">Tax Rate:</span>
                          <div className="relative flex-1">
                            <input
                              type="number"
                              name="taxRate"
                              value={formData.taxRate}
                              onChange={handleChange}
                              min="0"
                              max="100"
                              step="0.1"
                              className="input text-right pl-8"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500">
                              <PercentIcon className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-surface-700 dark:text-surface-300">Tax Amount:</span>
                          <span className="font-medium">{formatCurrency(formData.taxAmount)}</span>
                        </div>
                        
                        <div className="border-t border-surface-200 dark:border-surface-600 my-2 pt-2"></div>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total:</span>
                          <span className="font-bold text-xl text-primary">{formatCurrency(formData.total)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="label">Notes</label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          placeholder="Add any additional notes or payment instructions"
                          className="input resize-none h-28"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <button 
                      onClick={() => setActiveTab('items')}
                      className="btn btn-outline"
                    >
                      Back
                    </button>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowPreview(true)}
                        className="btn btn-outline flex items-center gap-2"
                      >
                        <EyeIcon className="h-4 w-4" />
                        Preview
                      </button>
                      <button 
                        onClick={saveInvoice}
                        className="btn btn-primary flex items-center gap-2"
                      >
                        <SaveIcon className="h-4 w-4" />
                        Save Invoice
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

// Invoice Preview Component
const InvoicePreview = ({ formData, onClose }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative"
    >
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-surface-700 dark:text-surface-300 hover:text-primary"
        >
          <BackIcon className="h-5 w-5" />
          Back to Editor
        </button>
        
        <div className="flex gap-2">
          <button className="btn btn-outline flex items-center gap-2">
            <PrintIcon className="h-4 w-4" />
            Print
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <SendIcon className="h-4 w-4" />
            Send
          </button>
        </div>
      </div>
      
      <div className="card p-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-1 text-primary">INVOICE</h1>
            <p className="text-xl font-semibold">{formData.invoiceNumber}</p>
          </div>
          
          <div className="mt-6 md:mt-0 text-right">
            <div className="text-sm text-surface-600 dark:text-surface-400 mb-1">Issue Date</div>
            <div className="font-medium">{new Date(formData.date).toLocaleDateString()}</div>
            <div className="text-sm text-surface-600 dark:text-surface-400 mt-3 mb-1">Due Date</div>
            <div className="font-medium">{new Date(formData.dueDate).toLocaleDateString()}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="text-sm text-surface-600 dark:text-surface-400 mb-2">From</div>
            <div className="font-semibold">Your Company Name</div>
            <div>123 Business Street</div>
            <div>City, State, ZIP</div>
            <div>yourcompany@example.com</div>
          </div>
          
          <div>
            <div className="text-sm text-surface-600 dark:text-surface-400 mb-2">Bill To</div>
            <div className="font-semibold">{formData.clientName || "Client Name"}</div>
            <div>{formData.clientEmail || "client@example.com"}</div>
            <div className="whitespace-pre-line">{formData.clientAddress || "Client Address"}</div>
          </div>
        </div>
        
        <div className="overflow-x-auto mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-surface-200 dark:border-surface-700 text-left">
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Quantity</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right rounded-r-lg">Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={item.id} className="border-b border-surface-200 dark:border-surface-700 last:border-0">
                  <td className="p-3">{item.description || "Item description"}</td>
                  <td className="p-3 text-right">{item.quantity}</td>
                  <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                  <td className="p-3 text-right">{formatCurrency(item.quantity * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-end">
          <div className="w-full md:w-64">
            <div className="flex justify-between py-2">
              <span className="text-surface-700 dark:text-surface-300">Subtotal</span>
              <span>{formatCurrency(formData.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-surface-200 dark:border-surface-700">
              <span className="text-surface-700 dark:text-surface-300">Tax ({formData.taxRate}%)</span>
              <span>{formatCurrency(formData.taxAmount)}</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(formData.total)}</span>
            </div>
          </div>
        </div>
        
        {formData.notes && (
          <div className="mt-8 pt-6 border-t border-surface-200 dark:border-surface-700">
            <h4 className="font-semibold mb-2">Notes</h4>
            <p className="text-surface-700 dark:text-surface-300">{formData.notes}</p>
          </div>
        )}
        
        <div className="mt-12 pt-6 border-t border-surface-200 dark:border-surface-700 text-center text-sm text-surface-600 dark:text-surface-400">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MainFeature;