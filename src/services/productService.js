// Product service for handling product-related operations

// Get all products with pagination and filtering
export const fetchProducts = async (page = 1, limit = 10, searchQuery = '') => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Build params object
    const params = {
      fields: [
        { field: { field: { name: "Id" } } },
        { field: { field: { name: "Name" } } },
        { field: { field: { name: "description" } } },
        { field: { field: { name: "price" } } }
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
              fieldName: "description",
              operator: "Contains",
              values: [searchQuery]
            }],
            operator: ""
          }
        ]
      }];
    }

    const response = await apperClient.fetchRecords("product", params);
    return {
      products: response.data || [],
      totalCount: response.count || 0
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Create new product
export const createProduct = async (productData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [productData]
    };

    const response = await apperClient.createRecord("product", params);
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update existing product
export const updateProduct = async (productData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [productData]
    };

    const response = await apperClient.updateRecord("product", params);
    return response.results[0].data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};