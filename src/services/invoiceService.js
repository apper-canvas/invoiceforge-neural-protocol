// Invoice service for handling invoice-related operations

// Get all invoices with pagination and filtering
export const fetchInvoices = async (page = 1, limit = 10, searchQuery = '', statusFilter = '') => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Build where conditions based on search query and status filter
    const whereConditions = [];
    
    if (searchQuery) {
      whereConditions.push({
        fieldName: "invoiceNumber",
        operator: "Contains",
        values: [searchQuery]
      });
      whereConditions.push({
        fieldName: "clientName",
        operator: "Contains",
        values: [searchQuery]
      });
    }
    
    if (statusFilter) {
      whereConditions.push({
        fieldName: "status",
        operator: "ExactMatch",
        values: [statusFilter]
      });
    }

    const params = {
      fields: [
        { field: { name: "Id" } },
        { field: { name: "Name" } },
        { field: { name: "invoiceNumber" } },
        { field: { name: "date" } },
        { field: { name: "dueDate" } },
        { field: { name: "clientName" } },
        { field: { name: "clientEmail" } },
        { field: { name: "clientAddress" } },
        { field: { name: "subtotal" } },
        { field: { name: "taxRate" } },
        { field: { name: "taxAmount" } },
        { field: { name: "total" } },
        { field: { name: "notes" } },
        { field: { name: "status" } }
      ],
      orderBy: [
        { field: "date", direction: "DESC" }
      ],
      pagingInfo: {
        limit: limit,
        offset: (page - 1) * limit
      }
    };

    // Add where conditions if any
    if (whereConditions.length > 0) {
      if (whereConditions.length === 1) {
        params.where = whereConditions;
      } else {
        // If we have multiple conditions, use OR for search terms
        params.whereGroups = [{
          operator: "OR",
          subGroups: whereConditions.map(condition => ({
            conditions: [condition],
            operator: ""
          }))
        }];
      }
    }

    const response = await apperClient.fetchRecords("invoice", params);
    return {
      invoices: response.data || [],
      totalCount: response.count || 0
    };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

// Get invoice by ID
export const getInvoiceById = async (invoiceId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById("invoice", invoiceId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching invoice with ID ${invoiceId}:`, error);
    throw error;
  }
};

// Create new invoice
export const createInvoice = async (invoiceData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [invoiceData]
    };

    const response = await apperClient.createRecord("invoice", params);
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

// Update existing invoice
export const updateInvoice = async (invoiceData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [invoiceData]
    };

    const response = await apperClient.updateRecord("invoice", params);
    return response.results[0].data;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};