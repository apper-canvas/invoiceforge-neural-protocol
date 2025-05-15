/**
 * Service for handling invoice-related operations
 */

export async function fetchInvoices(page = 1, limit = 10, filters = {}) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Build query parameters for filtering and pagination
    const params = {
      pagingInfo: {
        limit: limit,
        offset: (page - 1) * limit
      }
    };

    // Add filters if provided
    if (Object.keys(filters).length > 0) {
      params.where = [];
      
      // Handle status filter
      if (filters.status) {
        params.where.push({
          fieldName: "status",
          operator: "ExactMatch",
          values: [filters.status]
        });
      }
      
      // Handle date range filter
      if (filters.dateFrom && filters.dateTo) {
        params.where.push({
          fieldName: "date",
          operator: "Between",
          values: [filters.dateFrom, filters.dateTo]
        });
      }
      
      // Handle client name filter
      if (filters.clientName) {
        params.where.push({
          fieldName: "clientName",
          operator: "Contains",
          values: [filters.clientName]
        });
      }
    }

    const response = await apperClient.fetchRecords('invoice', params);

    return {
      invoices: response.data || [],
      total: response.total || 0
    };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
}

export async function getInvoiceById(id) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('invoice', id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching invoice with ID ${id}:`, error);
    throw error;
  }
}

export async function createInvoice(invoiceData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Prepare the data for saving to the database
    const params = {
      records: [{
        ...invoiceData,
        // Process any special fields or relations here
      }]
    };

    const response = await apperClient.createRecord('invoice', params);
    
    return {
      success: response.success || false
    };
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
}