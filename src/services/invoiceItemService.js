// Invoice item service for handling invoice item operations

// Get all items for a specific invoice
export const fetchInvoiceItems = async (invoiceId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { field: { name: "Id" } } },
        { field: { field: { name: "Name" } } },
        { field: { field: { name: "description" } } },
        { field: { field: { name: "quantity" } } },
        { field: { field: { name: "price" } } },
        { field: { field: { name: "total" } } },
        { field: { field: { name: "invoice_id" } } }
      ],
      where: [
        {
          fieldName: "invoice_id",
          operator: "ExactMatch",
          values: [invoiceId]
        }
      ]
    };

    const response = await apperClient.fetchRecords("invoice_item", params);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching invoice items for invoice ${invoiceId}:`, error);
    throw error;
  }
};

// Create invoice items in bulk
export const createInvoiceItems = async (items, invoiceId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Prepare items with invoice ID
    const recordsToCreate = items.map(item => ({
      ...item,
      invoice_id: invoiceId
    }));

    const params = {
      records: recordsToCreate
    };

    const response = await apperClient.createRecord("invoice_item", params);
    return response.results.map(result => result.data);
  } catch (error) {
    console.error("Error creating invoice items:", error);
    throw error;
  }
};

// Delete invoice items by invoice ID
export const deleteInvoiceItemsByInvoiceId = async (invoiceId) => {
  try {
    // First, fetch all items for this invoice to get their IDs
    const items = await fetchInvoiceItems(invoiceId);
    
    if (items.length === 0) {
      return { success: true, count: 0 };
    }
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const itemIds = items.map(item => item.Id);
    
    const params = {
      RecordIds: itemIds
    };

    const response = await apperClient.deleteRecord("invoice_item", params);
    return { success: true, count: itemIds.length };
  } catch (error) {
    console.error(`Error deleting invoice items for invoice ${invoiceId}:`, error);
    throw error;
  }
};