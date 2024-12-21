import api from "@/lib/api";
import { create } from "zustand";

interface Media {
  media_type: string;
  updated_at: string;
  land_id: number;
  id: number;
  url: string;
  created_at: string;
}

interface Land {
  id: number;
  title: string;
  live_square_area: number;
  agent_percent: number;
  agent_commission: number;
  category: string;
  floor_number: number;
  action_type: string;
  location: string;
  created_at: string;
  crm_id: string;
  description: string;
  furnished: boolean;
  updated_at: string;
  comment: string;
  house_condition: string;
  price: number;
  current_status: string;
  district: string;
  rooms: number;
  parking_place: boolean;
  square_area: number;
  responsible: string;
  second_responsible: string;
  media: Media[];
}

interface LandStore {
  lands: Land[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchLands: (page: number, limit: number) => Promise<void>;
  fetchLandById: (id: number) => Promise<Land | null>;
  searchLands: (query: string) => Promise<void>;
  searchError: string | null;
  searchLoading: boolean;
}

export const useLandStore = create<LandStore>((set) => ({
  lands: [],
  total: 0,
  loading: false,
  error: null,
  searchError: null,
  searchLoading: false,
  fetchLands: async (page: number, limit: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/land/?limit=${limit}&page=${page}`);
      const { data, total_count } = response.data; // Assuming API provides `data` and `total_count`
      set({
        lands: data, // Using `data` array from the response
        total: total_count || data.length, // Update total based on `total_count`
        loading: false,
      });
    } catch (error) {
      // Define the type of the error
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
          apiError.response?.data?.detail || apiError.message || "Failed to fetch lands",
        loading: false,
      });
    }
  },
  fetchLandById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/land/${id}`);
      set({ loading: false });
      return response.data; // Return the data
    } catch (error) {
      // Define the type of the error
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
          apiError.response?.data?.detail || apiError.message || "Failed to fetch land",
        loading: false,
      });
      return null; // Return null in case of error
    }
  },
  searchLands: async (query: string) => {
    set({ searchLoading: true, searchError: null });
    try {
      const response = await api.get(`/additional/search/?text=${query}&table=land`);
      console.log(Array.isArray(response.data) ? response.data : []);
      set({
        lands: Array.isArray(response.data) ? response.data : [], // Use `data` key
        total: Array.isArray(response.data) ? response.data.length : 0, // Use length of apartments array
        searchLoading: false,
      });
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: { data?: { detail?: string } };
      };
      console.log(apiError);
      set({
        searchError:
          apiError.response?.data?.detail || apiError.message || "Failed to fetch apartments",
        searchLoading: false,
        lands: [], // Reset to an empty array in case of error
      });
    }
  }
}));
