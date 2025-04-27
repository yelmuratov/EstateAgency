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

export interface Land {
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
  status_date: string;
  media: Media[];
  second_agent_percent: number;
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
  filterLands: (filters: Record<string, string>) => Promise<void>;
  filterError: string | null;
  deleteLand: (id: number) => Promise<void>;
}

export const useLandStore = create<LandStore>((set) => ({
  lands: [],
  total: 0,
  loading: false,
  error: null,
  searchError: null,
  searchLoading: false,
  filterError: null,

  fetchLands: async (page: number, limit: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/land/?limit=${limit}&page=${page}`);
      const { objects, filtered_count } = response.data; // <-- THIS IS CORRECT
      set({
        lands: objects, // Correct
        total: filtered_count || objects.length, // Correct
        loading: false,
      });
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: { data?: { detail?: string } };
      };
      set({
        error: apiError.response?.data?.detail || apiError.message || "Failed to fetch lands",
        loading: false,
      });
    }
  },

  fetchLandById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/land/${id}`);
      set({ loading: false });
      return response.data;
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: { data?: { detail?: string } };
      };
      set({
        error: apiError.response?.data?.detail || apiError.message || "Failed to fetch land",
        loading: false,
      });
      return null;
    }
  },

  searchLands: async (query: string) => {
    set({ searchLoading: true, searchError: null });
    try {
      const response = await api.get(`/additional/search/?text=${query}&table=land`);
      
      set({
        lands: Array.isArray(response.data) ? response.data : [],
        total: Array.isArray(response.data) ? response.data.length : 0,
        searchLoading: false,
      });
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: { data?: { detail?: string } };
      };
      set({
        searchError: apiError.response?.data?.detail || apiError.message || "Failed to search lands",
        searchLoading: false,
        lands: [],
      });
    }
  },  

  filterLands: async (filters) => {
    set({ loading: true, filterError: null });
    try {
      const response = await api.get(`/additional/filter/?table=land`, {
        params: filters,
      });
      const { objects, filtered_count } = response.data;
      set({
        lands: objects,
        total: filtered_count || objects.length,
        loading: false,
      });
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: { data?: { detail?: string } };
      };
      set({
        filterError: apiError.response?.data?.detail || apiError.message || "Failed to fetch lands",
        loading: false,
        lands: [],
      });
    }
  },

  deleteLand: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/land/${id}`);
      set((state) => ({
        lands: state.lands.filter((land) => land.id !== id),
        loading: false,
      }));
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: { data?: { detail?: string } };
      };
      set({
        error: apiError.response?.data?.detail || apiError.message || "Failed to delete land",
        loading: false,
      });
    }
  },
}));
