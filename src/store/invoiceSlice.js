import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  invoices: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  selectedInvoice: null,
  statisticsData: {
    totalRevenue: 0,
    outstanding: 0,
    paid: 0,
    pendingInvoices: 0,
    totalInvoices: 0,
    revenueChange: 0
  }
};

export const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setInvoices: (state, action) => {
      state.invoices = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setTotalCount: (state, action) => {
      state.totalCount = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSelectedInvoice: (state, action) => {
      state.selectedInvoice = action.payload;
    },
    setStatisticsData: (state, action) => {
      state.statisticsData = action.payload;
    }
  },
});

export const { setInvoices, setLoading, setError, setTotalCount, setCurrentPage, setSelectedInvoice, setStatisticsData } = invoiceSlice.actions;
export default invoiceSlice.reducer;