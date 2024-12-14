import { create } from "zustand";
import api from "@/lib/api";

interface Metro {
  name: string;
  id: number;
  created_at: string;
  updated_at: string;
}

interface District {
  name: string;
  id: number;
  created_at: string;
  updated_at: string;
}

interface StoreState {
  metros: Metro[];
  districts: District[];
  loading: boolean;
  error: string | null;
  fetchMetros: () => Promise<void>;
  fetchDistricts: () => Promise<void>;
}

const usePropertyStore = create<StoreState>((set) => ({
  metros: [],
  districts: [],
  loading: false,
  error: null,
  fetchMetros: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<Metro[]>("/metro/");
      set({ metros: response.data, loading: false });
    } catch (error) {
      // Define the type for the error object
      const apiError = error as {
        message?: string;
        response?: {
          data?: {
            detail?: string;
          };
        };
      };
  
      set({
        error: apiError.response?.data?.detail || apiError.message || "Failed to fetch metros",
        loading: false,
      });
    }
  },
  fetchDistricts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<District[]>("/district/");
      set({ districts: response.data, loading: false });
    } catch (error) {
      // Define the type for the error object
      const apiError = error as {
        message?: string;
        response?: {
          data?: {
            detail?: string;
          };
        };
      };
  
      set({
        error: apiError.response?.data?.detail || apiError.message || "Failed to fetch districts",
        loading: false,
      });
    }
  },  
}));

export default usePropertyStore;
