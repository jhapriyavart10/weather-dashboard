import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface WeatherData {
  cityId: string;
  cityName: string;
  temperature: number;
  humidity: number;
  condition: string;
  icon: string;
  lastUpdated: string;
  pressure: number;
  sunrise: string;
  sunset: string;
  forecast: {
    date: string;
    temperature: number;
    condition: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    direction?: string; // Optional property for wind direction
  };
}


interface WeatherState {
  cities: WeatherData[];
  loading: boolean;
  error: string | null;
  selectedCity: WeatherData | null;
}

const initialState: WeatherState = {
  cities: [],
  loading: false,
  error: null,
  selectedCity: null,
};

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/weather');
      // Extract cities array or use an empty array as fallback
      const cities = response.data.cities || [];
      
      // Additional debugging
      console.log('Weather API response:', response.data);
      console.log('Extracted cities:', cities);
      
      return cities; // Return just the cities array
    } catch (error) {
      console.error('Weather API error:', error);
      return rejectWithValue('Failed to fetch weather data');
    }
  }
);

export const fetchCityWeather = createAsyncThunk(
  'weather/fetchCityWeather',
  async (cityId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/weather/${cityId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(`Failed to fetch weather for city ${cityId}`);
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    updateWeather: (state, action: PayloadAction<WeatherData>) => {
      const cityIndex = state.cities.findIndex(city => city.cityId === action.payload.cityId);
      if (cityIndex !== -1) {
        state.cities[cityIndex] = action.payload;
      }
    },
    setSelectedCity: (state, action: PayloadAction<WeatherData | null>) => {
      state.selectedCity = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCityWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCityWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCity = action.payload;
      })
      .addCase(fetchCityWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateWeather, setSelectedCity } = weatherSlice.actions;
export default weatherSlice.reducer;