import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  lastUpdated: string;
  totalVolume?: number;
  circulatingSupply?: number;
  totalSupply?: number;
  maxSupply?: number;
  ath?: number;
  athDate?: string;
  image?: string;
  description?: string;
}

interface CryptoState {
  data: CryptoData[]; // Add this line
  selectedCrypto: CryptoData | null;
  historicalData: Record<string, any> | null;
  loading: boolean;
  error: string | null;
  cryptoId?: string;
  days?: number;
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
 // Added description property
}

const initialState: CryptoState = {
  data: [],
  loading: false,
  error: null,
  selectedCrypto: null,
  historicalData: null,
  id: '',
  name: '',
  symbol: '',
  price: 0,
  priceChange24h: 0,
  marketCap: 0,
};

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      // We'll implement the actual API endpoint later
      const response = await axios.get('/api/crypto');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch crypto data');
    }
  }
);

export const fetchCryptoDetails = createAsyncThunk(
  'crypto/fetchDetails',
  async (cryptoId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/crypto/${cryptoId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(`Failed to fetch details for crypto ${cryptoId}`);
    }
  }
);

// In your cryptoSlice.ts file
export const fetchCryptoHistory = createAsyncThunk(
  'crypto/fetchHistory',
  async ({ cryptoId, days }: { cryptoId: string; days: number }, thunkAPI) => {
    try {
      const response = await axios.get(`/api/crypto/${cryptoId}/history?days=${days}`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('An unknown error occurred');
    }
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updatePrice: (state, action: PayloadAction<{ id: string; price: number }>) => {
      const { id, price } = action.payload;
      const cryptoIndex = state.data.findIndex(crypto => crypto.id === id);
      if (cryptoIndex !== -1) {
        state.data[cryptoIndex].price = price;
        state.data[cryptoIndex].lastUpdated = new Date().toISOString();
      }
    },
    setSelectedCrypto: (state, action: PayloadAction<CryptoData | null>) => {
      state.selectedCrypto = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCryptoDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCrypto = action.payload;
      })
      .addCase(fetchCryptoDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updatePrice, setSelectedCrypto } = cryptoSlice.actions;
export default cryptoSlice.reducer;