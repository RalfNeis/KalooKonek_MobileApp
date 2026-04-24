import axios from 'axios';
import { supabase } from '../lib/supabase'; // We import Supabase instead of AsyncStorage

// Removed '/api/' so it perfectly matches your Django backend
const API_URL = 'http://10.0.2.2:8000/'; 

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach JWT Token to every request
apiClient.interceptors.request.use(async (config) => {
  // Directly ask Supabase for the active token
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});