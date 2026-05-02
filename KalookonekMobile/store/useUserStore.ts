import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/client';

// --- Django Interfaces ---
interface PatientInfo {
  date_of_birth: string;
  age: number;
  sex: string;
  blood_type: string;
  address: string;
  barangay: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  allergies: string;
}

interface UserData {
  display_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  phone_number: string;
  osca_id?: string;
  patient_info: PatientInfo | null;
}

interface DashboardData {
  display_id: string;
  name: string;
  upcoming_appointments?: any[]; // Added the ? here for safety!
  recent_records?: any[];        // Added the ? here for safety!
  medicines?: any[];             // Moved this OUTSIDE of announcements!
  announcements: {
    id: number;
    title: string;
    body: string;
    date: string;
  }[];
}

interface UserState {
  user: UserData | null;
  dashboard: DashboardData | null;
  isLoading: boolean;
  lastUpdated: string | null;
  fetchUserFromDjango: () => Promise<void>;
  fetchDashboardFromDjango: () => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      dashboard: null,
      isLoading: false,
      lastUpdated: null,

      fetchUserFromDjango: async () => {
        set({ isLoading: true });
        try {
          const response = await apiClient.get('user/'); 
          set({ user: response.data, lastUpdated: new Date().toISOString(), isLoading: false });
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          set({ isLoading: false });
        }
      },

      fetchDashboardFromDjango: async () => {
        set({ isLoading: true });
        try {
          const response = await apiClient.get('dashboard/'); 
          set({ dashboard: response.data, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch dashboard", error);
          set({ isLoading: false });
        }
      },

      clearUser: () => set({ user: null, dashboard: null, lastUpdated: null }),
    }),
    {
      name: 'kalookonek-user-storage',
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);