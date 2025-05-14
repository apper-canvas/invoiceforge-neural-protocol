import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clients: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  selectedClient: null
};

export const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients: (state, action) => {
      state.clients = action.payload;
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
    setSelectedClient: (state, action) => {
      state.selectedClient = action.payload;
    },
    addClient: (state, action) => {
      state.clients.push(action.payload);
    },
    updateClientInList: (state, action) => {
      const index = state.clients.findIndex(client => client.Id === action.payload.Id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    }
  },
});

export const { setClients, setLoading, setError, setTotalCount, setCurrentPage, setSelectedClient, addClient, updateClientInList } = clientSlice.actions;
export default clientSlice.reducer;