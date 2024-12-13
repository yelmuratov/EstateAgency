import api from "@/lib/api";
import {create} from "zustand";

interface Media {
  url: string;
  commercial_id: number;
  id: number;
  created_at: string;
  media_type: string;
  updated_at: string;
}

interface Commercial {
  id: number;
  title: string;
  category: string;
  action_type: string;
  description: string;
  comment: string;
  price: number;
  rooms: number;
  square_area: number;
  floor_number: number;
  location: string;
  furnished: boolean;
  house_condition: string;
  current_status: string;
  parking_place: boolean;
  agent_percent: number;
  agent_commission: number;
  crm_id: string;
  responsible: string;
  district: string;
  created_at: string;
  updated_at: string;
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
          commercials: response.data.results,
          total: response.data.count,
          loading: false,
        });
      } catch (error: any) {
        set({
          error: error.message || 'Failed to fetch commercials',
          loading: false,
        });
      }
    },
  }));