import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use 10.0.2.2 for Android Emulators connecting to local Django (127.0.0.1:8000)
// For physical devices on Expo Go, use your computer's local IP address (e.g., [http://192.168.1.5:8000](http://192.168.1.5:8000))
const API_URL = '[http://10.0.2.2:8000/api/](http://10.0.2.2:8000/api/)'; 

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach JWT Token to every request (if they are logged in)
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
