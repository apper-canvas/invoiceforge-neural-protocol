import { motion, useScroll } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Icons
const BackIcon = getIcon('ArrowLeft');
const PrintIcon = getIcon('Printer');
const SendIcon = getIcon('Send');

const InvoicePreview = ({ formData, onClose, hideControls = false, forwardedRef }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <div 
      className="h-full overflow-y-auto border-l border-surface-200 dark:border-surface-700" 
      ref={forwardedRef}
    >
      <div className="p-6">
        {!hideControls && (
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
        )}
        
        <motion.div
          initial={hideControls ? false : { opacity: 0, y: 20 }}
          animate={hideControls ? {} : { opacity: 1, y: 0 }}
          exit={hideControls ? {} : { opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
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
                  {formData.items.map((item) => (
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
      </div>
    </div>
  );
};

export default InvoicePreview;