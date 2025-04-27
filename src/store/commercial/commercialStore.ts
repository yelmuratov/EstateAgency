import api from "@/lib/api";
import { create } from "zustand";

interface Media {
  media_type: string;
  updated_at: string;
  commercial_id: number;
  id: number;
  url: string;
  created_at: string;
  filterError: string | null;
}

interface Commercial {
  id: number;
  title: string;
  rooms: number;
  square_area: number;
  agent_percent: number;
  agent_commission: number;
  second_responsible?: string;
  second_agent_percent?: number;
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
  status_date?: string;
}

interface CommercialStore {
  commercials: Commercial[];
  total: number;
  loading: boolean;
  error: string | null;
  searchError: string | null;
  searchLoading: boolean;
  filterError: string | null;
  // Removed fetchCommercials method
  fetchCommercialById: (id: number) => Promise<Commercial | null>;
  searchCommercial: (search: string) => Promise<void>;
  filterCommercials: (filters: Record<string, string>, type: string) => Promise<void>;
  deleteCommercial: (id: number) => Promise<void>;
}

export const useCommercialStore = create<CommercialStore>((set) => ({
  commercials: [],
  total: 0,
  loading: false,
  error: null,
  searchError: null,
  searchLoading: false,
  filterError: null,

  fetchCommercialById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/commercial/${id}`);
      set({ loading: false });
      return response.data as Commercial;
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: { data?: { detail?: string } };
      };
      set({
        error: apiError.response?.data?.detail || apiError.message || "Failed to fetch commercial",
        loading: false,
      });
      return null;
    }
  },

  searchCommercial: async (query: string) => {
    set({ searchLoading: true, searchError: null });
    try {
      const response = await api.get(`/additional/search/?text=${query}&table=commercial`);
      
      set({
        commercials: Array.isArray(response.data) ? response.data : [],
        total: Array.isArray(response.data) ? response.data.length : 0,
        searchLoading: false,
      });
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: { data?: { detail?: string } };
      };
      set({
        searchError:
          apiError.response?.data?.detail || apiError.message || "Failed to search commercials",
        searchLoading: false,
        commercials: [],
      });
    }
  }
,   

  filterCommercials: async (filters, type) => {
    set({ loading: true, filterError: null });
    try {
      const response = await api.get(`/additional/filter/?table=commercial&action_type=${type}`, {
        params: filters,
      });
      const { objects, filtered_count } = response.data;
      set({
        commercials: objects,
        total: filtered_count || objects.length,
        loading: false,
      });
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: { data?: { detail?: string } };
      };
      set({
        filterError: apiError.response?.data?.detail || apiError.message || "Failed to fetch commercials",
        loading: false,
        commercials: [],
      });
    }
  },

  deleteCommercial: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/commercial/${id}`);
      set((state) => ({
        commercials: state.commercials.filter((commercial) => commercial.id !== id),
        loading: false,
      }));
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: { data?: { detail?: string } };
      };
      set({
        error: apiError.response?.data?.detail || apiError.message || "Failed to delete commercial",
        loading: false,
      });
    }
  },
}));

