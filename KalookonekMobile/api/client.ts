import axios from 'axios';
import { supabase } from '../lib/supabase'; 

const API_URL = 'http://10.0.2.2:8000/';
//const API_URL = 'http://192.168.1.X:8000/api/';

export const apiClient = axios.create({
  baseURL: API_URL,
  //baseURL: 'https://angry-aliens-spend.loca.lt',
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