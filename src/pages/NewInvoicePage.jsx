import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import MainFeature from '../components/MainFeature';
import InvoicePreview from '../components/InvoicePreview';
import getIcon from '../utils/iconUtils';
import { createInvoice } from '../services/invoiceService';

// Icons
const MenuIcon = getIcon('Menu');
const ChevronLeftIcon = getIcon('ChevronLeft');
const ChevronRightIcon = getIcon('ChevronRight');

const NewInvoicePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPreviewOnMobile, setShowPreviewOnMobile] = useState(false);
  const formRef = useRef(null);
  const previewRef = useRef(null);

  // Initialize invoice with default values
  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
    date: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(new Date().setDate(new Date().getDate() + 30)), 'yyyy-MM-dd'),
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    items: [
      { id: 1, description: '', quantity: 1, price: 0, total: 0 }
    ],
    subtotal: 0,
    taxRate: 8.5,
    taxAmount: 0,
    total: 0,
    notes: '',
    status: 'pending'
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Validate form
      if (!formData.clientName) {
        toast.error("Please enter a client name");
        return;
      }
      
      if (!formData.clientEmail) {
        toast.error("Please enter a client email");
        return;
      }
      
      // Check if at least one item has a description and price
      const validItems = formData.items.filter(item => item.description && item.price > 0);
      if (validItems.length === 0) {
        toast.error("Please add at least one item with description and price");
        return;
      }
      
      // Call API to save invoice
      const result = await createInvoice(formData);
      
      if (result.success) {
        toast.success("Invoice created successfully!");
        navigate('/invoices');
      } else {
        toast.error("Failed to create invoice");
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("An error occurred while saving the invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Mobile toggle button */}
      <div className="md:hidden flex justify-end mb-4">
        <button
          onClick={() => setShowPreviewOnMobile(!showPreviewOnMobile)}
          className="btn btn-outline flex items-center gap-2"
        >
          {showPreviewOnMobile ? (
            <>
              <ChevronLeftIcon className="h-4 w-4" />
              Back to Form
            </>
          ) : (
            <>
              Preview
              <ChevronRightIcon className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Split screen layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-[calc(100vh-150px)]">
        <div className={`md:col-span-3 ${showPreviewOnMobile ? 'hidden md:block' : 'block'}`}>
          <MainFeature formData={formData} setFormData={setFormData} onSave={handleSave} loading={loading} ref={formRef} />
        </div>
        <div className={`md:col-span-2 ${showPreviewOnMobile ? 'block' : 'hidden md:block'} bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 h-full overflow-hidden`}>
          <InvoicePreview formData={formData} hideControls={true} forwardedRef={previewRef} />
        </div>
      </div>
    </div>
  );
};

export default NewInvoicePage;