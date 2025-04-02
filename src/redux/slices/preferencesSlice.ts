import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PreferencesState {
  favoriteCities: string[];
  favoriteCryptos: string[];
  theme: 'light' | 'dark';
  temperatureUnit: 'celsius' | 'fahrenheit';
}

const initialState: PreferencesState = {
  favoriteCities: ['new-york', 'london', 'tokyo'],
  favoriteCryptos: ['bitcoin', 'ethereum', 'solana'],
  theme: 'light',
  temperatureUnit: 'celsius',
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    addFavoriteCity: (state, action: PayloadAction<string>) => {
      if (!state.favoriteCities.includes(action.payload)) {
        state.favoriteCities.push(action.payload);
      }
    },
    removeFavoriteCity: (state, action: PayloadAction<string>) => {
      state.favoriteCities = state.favoriteCities.filter(city => city !== action.payload);
    },
    addFavoriteCrypto: (state, action: PayloadAction<string>) => {
      if (!state.favoriteCryptos.includes(action.payload)) {
        state.favoriteCryptos.push(action.payload);
      }
    },
    removeFavoriteCrypto: (state, action: PayloadAction<string>) => {
      state.favoriteCryptos = state.favoriteCryptos.filter(crypto => crypto !== action.payload);
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setTemperatureUnit: (state, action: PayloadAction<'celsius' | 'fahrenheit'>) => {
      state.temperatureUnit = action.payload;
    },
  },
});

export const { 
  addFavoriteCity, 
  removeFavoriteCity, 
  addFavoriteCrypto, 
  removeFavoriteCrypto, 
  setTheme, 
  setTemperatureUnit 
} = preferencesSlice.actions;

export default preferencesSlice.reducer;