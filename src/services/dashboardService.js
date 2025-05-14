// Dashboard service for handling dashboard statistics and data

// Get dashboard statistics
export const fetchDashboardStatistics = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Fetch all invoices to calculate statistics
    const params = {
      fields: [
        { field: { name: "Id" } },
        { field: { name: "invoiceNumber" } },
        { field: { name: "date" } },
        { field: { name: "total" } },
        { field: { name: "status" } }
      ]
    };

    const response = await apperClient.fetchRecords("invoice", params);
    const invoices = response.data || [];
    
    // Calculate statistics
    let totalRevenue = 0;
    let outstanding = 0;
    let paid = 0;
    let pendingInvoices = 0;
    let totalInvoices = invoices.length;
    
    // Get invoices from last 30 days for revenue change calculation
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    // Get invoices from 30-60 days ago for comparison
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(today.getDate() - 60);
    
    let revenueLastThirtyDays = 0;
    let revenuePreviousThirtyDays = 0;
    
    invoices.forEach(invoice => {
      const invoiceDate = new Date(invoice.date);
      const invoiceTotal = parseFloat(invoice.total) || 0;
      
      // Add to total revenue
      totalRevenue += invoiceTotal;
      
      // Calculate outstanding vs paid
      if (invoice.status === 'paid') {
        paid += invoiceTotal;
      } else {
        outstanding += invoiceTotal;
        pendingInvoices += 1;
      }
      
      // Calculate revenue for last 30 days
      if (invoiceDate >= thirtyDaysAgo) {
        revenueLastThirtyDays += invoiceTotal;
      }
      
      // Calculate revenue for previous 30 days (30-60 days ago)
      if (invoiceDate >= sixtyDaysAgo && invoiceDate < thirtyDaysAgo) {
        revenuePreviousThirtyDays += invoiceTotal;
      }
    });
    
    // Calculate revenue change percentage
    let revenueChange = 0;
    if (revenuePreviousThirtyDays > 0) {
      revenueChange = ((revenueLastThirtyDays - revenuePreviousThirtyDays) / revenuePreviousThirtyDays) * 100;
      revenueChange = parseFloat(revenueChange.toFixed(1));
    }
    
    // Return statistics
    return {
      totalRevenue,
      outstanding,
      paid,
      pendingInvoices,
      totalInvoices,
      revenueChange
    };
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    throw error;
  }
};