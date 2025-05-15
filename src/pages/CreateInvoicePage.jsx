import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import InvoicePreview from '../components/InvoicePreview';
import { createInvoice } from '../services/invoiceService';
import { createInvoiceItems } from '../services/invoiceItemService';
import getIcon from '../utils/iconUtils';

// Icons
const DesktopIcon = getIcon('Monitor');
const MobileIcon = getIcon('Smartphone');
const EyeIcon = getIcon('Eye');
const EditIcon = getIcon('Edit');

const CreateInvoicePage = () => {
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
  
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('split'); // 'form', 'preview', or 'split'
  const navigate = useNavigate();
  
  // Refs for scroll synchronization
  const formRef = useRef(null);
  const previewRef = useRef(null);
  
  // Switch to form-only view on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setViewMode('form');
      } else {
        setViewMode('split');
      }
    };
    
    // Initialize
    handleResize();
    
    // Add listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
  
  // Handle saving the invoice
  const handleSaveInvoice = async () => {
    // Validate form
    if (!formData.clientName) {
      toast.error("Please enter client name");
      return;
    }

    if (!formData.clientEmail) {
      toast.error("Please enter client email");
      return;
    }

    // Check if any item has empty description
    const hasEmptyItems = formData.items.some(item => !item.description);
    if (hasEmptyItems) {
      toast.error("Please fill in all item descriptions");
      return;
    }

    try {
      setLoading(true);
      
      // Prepare invoice data for creation
      const invoiceData = {
        invoiceNumber: formData.invoiceNumber,
        date: formData.date,
        dueDate: formData.dueDate,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientAddress: formData.clientAddress,
        subtotal: formData.subtotal,
        taxRate: formData.taxRate,
        taxAmount: formData.taxAmount,
        total: formData.total,
        notes: formData.notes,
        status: 'pending'
      };
      
      // Create invoice in database
      const createdInvoice = await createInvoice(invoiceData);
      
      // Create invoice items
      const invoiceItems = formData.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        invoice_id: createdInvoice.Id
      }));
      
      await createInvoiceItems(invoiceItems, createdInvoice.Id);
      
      toast.success("Invoice saved successfully!");
      navigate('/invoices');
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* View mode toggle - only for mobile/tablet */}
      {window.innerWidth < 1024 && (
        <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg p-2 mb-6 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('form')}
              className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium ${
                viewMode === 'form'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700'
              }`}
            >
              <EditIcon className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium ${
                viewMode === 'preview'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700'
              }`}
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              Preview
            </button>
          </div>
        </div>
      )}
      
      {/* Split screen layout - desktop */}
      <div className={`flex flex-col lg:flex-row gap-6 h-[calc(100vh-15rem)]`}>
        {/* Form side */}
        <div className={`
          ${viewMode === 'preview' ? 'hidden' : 'block'} 
          ${viewMode === 'split' ? 'lg:w-1/2' : 'w-full'} 
          bg-white dark:bg-surface-800 rounded-lg shadow-sm overflow-hidden
        `}>
          <MainFeature 
            formData={formData} 
            setFormData={setFormData} 
            onSave={handleSaveInvoice}
            loading={loading}
            ref={formRef}
          />
        </div>
        
        {/* Preview side */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`
            ${viewMode === 'form' ? 'hidden' : 'block'}
            ${viewMode === 'split' ? 'lg:w-1/2' : 'w-full'} 
            bg-white dark:bg-surface-800 rounded-lg shadow-sm overflow-hidden
          `}>
            <InvoicePreview 
              formData={formData} 
              hideControls={true}
              forwardedRef={previewRef}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateInvoicePage;