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
  description: string;
  furnished: boolean;
  updated_at: string;
  comment: string;
  house_condition: string;
  price: number;
  current_status: string;
  district: string;
  responsible: string;
  media: Media[];
}

interface CommercialStore {
  commercials: Commercial[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchCommercials: (page: number, limit: number) => Promise<void>;
}

export const useCommercialStore = create<CommercialStore>((set) => ({
  commercials: [],
  total: 0,
  loading: false,
  error: null,
  fetchCommercials: async (page: number, limit: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/commercial/?limit=${limit}&page=${page}`);
      set({
        commercials: Array.isArray(response.data.data) ? response.data.data : [], // Use `data` key
        total: response.data.total_count || 0, // Use `total_count` key
        loading: false,
      });
    } catch (error) {
      // Define a specific error type
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
          apiError.response?.data?.detail || apiError.message || "Failed to fetch commercials",
        loading: false,
        commercials: [], // Reset to an empty array in case of error
      });
    }
  },  
}));
