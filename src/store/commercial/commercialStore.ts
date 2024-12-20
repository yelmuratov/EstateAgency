import api from "@/lib/api";
import { create } from "zustand";

interface Media {
  media_type: string;
  updated_at: string;
  commercial_id: number;
  id: number;
  url: string;
  created_at: string;
}

interface Commercial {
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
  description?: string;
  furnished?: boolean;
  updated_at: string;
  comment?: string;
  house_condition?: string;
  price: number;
  current_status?: string;
  district?: string;
  responsible?: string;
  floor_number?: number; // Optional field
  parking_place?: boolean; // Optional field
  media?: Media[];
}

interface CommercialStore {
  commercials: Commercial[];
  total: number;
  loading: boolean;
  error: string | null;
  searchError: string | null;
  searchLoading: boolean;
  filterError: string | null;
  fetchCommercials: (page: number, limit: number) => Promise<void>;
  fetchCommercialById: (id: number) => Promise<Commercial | null>;
  searchCommercial: (search: string) => Promise<void>;
  filterCommercials: (filters: Record<string, string>) => Promise<void>;
}

export const useCommercialStore = create<CommercialStore>((set) => ({
  commercials: [],
  total: 0,
  loading: false,
  error: null,
  searchError: null,
  searchLoading: false,
  filterError: null,
  // Fetch a paginated list of commercials
  fetchCommercials: async (page: number, limit: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/commercial/?limit=${limit}&page=${page}`);
      set({
        commercials: Array.isArray(response.data.data) ? response.data.data : [],
        total: response.data.total_count || 0,
        loading: false,
      });
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: { data?: { detail?: string } };
      };

      set({
        error:
          apiError.response?.data?.detail || apiError.message || "Failed to fetch commercials",
        loading: false,
      });
    }
  },
  // Fetch a single commercial by ID
  fetchCommercialById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/commercial/${id}`);
      return response.data as Commercial;
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: { data?: { detail?: string } };
      };

      set({
        error:
          apiError.response?.data?.detail || apiError.message || "Failed to fetch commercial",
        loading: false,
      });
      return null;
    }
  },
  // Search for commercials
  searchCommercial: async (query: string) => {
    set({ searchLoading: true, searchError: null });
    try {
      const response = await api.get(`/additional/search/?text=${query}&table=commercial`);
      console.log(Array.isArray(response.data) ? response.data : []);
      set({
        commercials: Array.isArray(response.data) ? response.data : [], // Use `data` key
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
        commercials: [], // Reset to an empty array in case of error
      });
    }
  },
  // Filter commercials
  filterCommercials: async (filters: Record<string, string>) => {
    set({ loading: true, error: null });
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams({ table: "commercial", ...filters }).toString();
  
      // Send request with proper query parameters
      const response = await api.get(`/additional/filter/?${queryParams}`);
  
      set({
        commercials: Array.isArray(response.data.data) ? response.data.data : [],
        total: response.data.total_count || 0,
        loading: false,
      });
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: { data?: { detail?: string } };
      };
  
      set({
        filterError:
          apiError.response?.data?.detail || apiError.message || "Failed to filter commercials",
        loading: false,
      });
    }
  },
}));
