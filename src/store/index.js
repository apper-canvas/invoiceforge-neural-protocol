import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import invoiceReducer from './invoiceSlice';
import clientReducer from './clientSlice';
import productReducer from './productSlice';

// Configure the Redux store with all reducers
export const store = configureStore({
  reducer: {
    user: userReducer,
    invoices: invoiceReducer,
    clients: clientReducer,
    products: productReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});