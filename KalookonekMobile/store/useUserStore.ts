import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/client';

// Define the shape of your Django User Data
interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  osca_id: string;
  address: string;
  avatar: string;
  bp: string;
  sugar: string;
  weight: string;
}

interface UserState {
  user: UserData | null;
  isLoading: boolean;
  lastUpdated: string | null;
  fetchUserFromDjango: () => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null, // Initially null
      isLoading: false,
      lastUpdated: null,

      // This function talks to Django
      fetchUserFromDjango: async () => {
        set({ isLoading: true });
        try {
          // Replace '/profile/' with your actual Django endpoint
          const response = await apiClient.get('/profile/'); 
          
          set({ 
            user: response.data, 
            lastUpdated: new Date().toISOString(),
            isLoading: false 
          });
        } catch (error) {
          console.error("Failed to fetch from Django, keeping offline data.", error);
          set({ isLoading: false });
        }
      },

      // Use this for Sign Out
      clearUser: () => set({ user: null, lastUpdated: null }),
    }),
    {
      name: 'kalookonek-user-storage', // The key used in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);
