import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  selectedProduct: null
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
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
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProductInList: (state, action) => {
      const index = state.products.findIndex(product => product.Id === action.payload.Id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    }
  },
});

export const { setProducts, setLoading, setError, setTotalCount, setCurrentPage, setSelectedProduct, addProduct, updateProductInList } = productSlice.actions;
export default productSlice.reducer;