// Reports service for handling report generation and data fetching

// Get sales by month report data
export const fetchSalesByMonthReport = async (year = new Date().getFullYear()) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { "field": { "field": { "name": "Id" } } },
        { "field": { "field": { "name": "date" } } },
        { "field": { "field": { "name": "total" } } },
        { "field": { "field": { "name": "status" } } }
      ],
      pagingInfo: {
        limit: 1000,
        offset: 0
      }
    };

    const response = await apperClient.fetchRecords("invoice", params);
    const invoices = response.data || [];
    
    // Process data for monthly sales report
    const monthlySales = Array(12).fill(0);
    
    invoices.forEach(invoice => {
      const invoiceDate = new Date(invoice.date);
      if (invoiceDate.getFullYear() === year && invoice.status === 'paid') {
        const month = invoiceDate.getMonth();
        monthlySales[month] += parseFloat(invoice.total) || 0;
      }
    });
    
    return monthlySales;
  } catch (error) {
    console.error("Error fetching sales by month report:", error);
    throw error;
  }
};

// Get invoice status report data
export const fetchInvoiceStatusReport = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { "field": { "field": { "name": "Id" } } },
        { "field": { "field": { "name": "status" } } },
        { "field": { "field": { "name": "total" } } }
      ],
      pagingInfo: {
        limit: 1000,
        offset: 0
      }
    };

    const response = await apperClient.fetchRecords("invoice", params);
    const invoices = response.data || [];
    
    // Calculate status totals
    const statusTotals = {
      paid: 0,
      pending: 0,
      overdue: 0
    };
    
    invoices.forEach(invoice => {
      const status = invoice.status || 'pending';
      const total = parseFloat(invoice.total) || 0;
      
      if (statusTotals[status] !== undefined) {
        statusTotals[status] += total;
      }
    });
    
    return statusTotals;
  } catch (error) {
    console.error("Error fetching invoice status report:", error);
    throw error;
  }
};

// Get top clients report
export const fetchTopClientsReport = async (limit = 5) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Fetch all invoices
    const params = {
      fields: [
        { "field": { "field": { "name": "Id" } } },
        { "field": { "field": { "name": "clientName" } } },
        { "field": { "field": { "name": "total" } } },
        { "field": { "field": { "name": "status" } } }
      ],
      pagingInfo: {
        limit: 1000,
        offset: 0
      }
    };

    const response = await apperClient.fetchRecords("invoice", params);
    const invoices = response.data || [];
    
    // Implementation for top clients calculation
    // This would aggregate invoices by client and calculate totals
    
    return [];
  } catch (error) {
    console.error("Error fetching top clients report:", error);
    throw error;
  }
};