import api from "@/lib/api";
import { create } from "zustand";

interface Media {
  media_type: string;
  updated_at: string;
  apartment_id: number;
  id: number;
  url: string;
  created_at: string;
}

interface Apartment {
  id: number;
  title: string;
  rooms: number;
  square_area: number;
  agent_percent: number;
  agent_commission: number;
  action_type: string;
  location: string;
  created_at: string;
  crm_id: string;
  description: string;
  category: string;
  furnished: boolean;
  updated_at: string;
  comment: string;
  house_condition: string;
  house_type: string;
  price: number;
  current_status: string;
  district: string;
  responsible: string;
  floor_number: number;
  floor: number;
  name: string;
  phone_number: string;
  bathroom: string;
  media: Media[];
  metro_st: string;
}

interface ApartmentStore {
  apartments: Apartment[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchApartments: (page: number, limit: number) => Promise<void>;
  fetchApartmentById: (id: number) => Promise<Apartment | null>;
}

export const useApartmentStore = create<ApartmentStore>((set) => ({
  apartments: [],
  total: 0,
  loading: false,
  error: null,
  fetchApartments: async (page: number, limit: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/apartment/?limit=${limit}&page=${page}`);
      set({
        apartments: Array.isArray(response.data.data) ? response.data.data : [], // Use `data` key
        total: response.data.total_count || 0, // Use `total_count` key
        loading: false,
      });
    } catch (error) {
      // Define a specific type for the error object
      const apiError = error as {
        message?: string;
        response?: {
          data?: {
            detail?: string;
          };
        };
      };
  
      set({
        error:
          apiError.response?.data?.detail || apiError.message || "Failed to fetch apartments",
        loading: false,
        apartments: [], // Reset to an empty array in case of error
      });
    }
  },
  fetchApartmentById: async (id: number) => {
    try {
      console.log('fetching id:', id);
      const response = await api.get(`/apartment/${id}`);
      console.log('response:', response.data);
      return response.data;
    } catch (error) {
      // Define a specific type for the error object
      const apiError = error as {
        message?: string;
        response?: {
          data?: {
            detail?: string;
          };
        };
      };
  
      set({
        error:
          apiError.response?.data?.detail || apiError.message || "Failed to fetch apartment",
        loading: false,
      })

      return null;
    }
  },  
}));
