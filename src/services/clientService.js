// Client service for handling client-related operations

// Get all clients with pagination and filtering
export const fetchClients = async (page = 1, limit = 10, searchQuery = '') => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Build params object
    const params = {
      fields: [
        { field: { name: "Id" } },
        { field: { name: "Name" } },
        { field: { name: "email" } },
        { field: { name: "address" } }
      ],
      orderBy: [
        { field: "Name", direction: "ASC" }
      ],
      pagingInfo: {
        limit: limit,
        offset: (page - 1) * limit
      }
    };

    // Add search condition if search query exists
    if (searchQuery) {
      params.whereGroups = [{
        operator: "OR",
        subGroups: [
          {
            conditions: [{
              fieldName: "Name",
              operator: "Contains",
              values: [searchQuery]
            }],
            operator: ""
          },
          {
            conditions: [{
              fieldName: "email",
              operator: "Contains",
              values: [searchQuery]
            }],
            operator: ""
          }
        ]
      }];
    }

    const response = await apperClient.fetchRecords("client", params);
    return {
      clients: response.data || [],
      totalCount: response.count || 0
    };
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

// Create new client
export const createClient = async (clientData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [clientData]
    };

    const response = await apperClient.createRecord("client", params);
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

// Update existing client
export const updateClient = async (clientData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [clientData]
    };

    const response = await apperClient.updateRecord("client", params);
    return response.results[0].data;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};