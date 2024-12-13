import api from "@/lib/api";
import {create} from "zustand";

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
  media: Media[];
}

interface LandStore {
    lands: Land[];
    total: number;
    loading: boolean;
    error: string | null;
    fetchLands: (page: number, limit: number) => Promise<void>;
  }

  export const useLandStore = create<LandStore>((set) => ({
    lands: [],
    total: 0,
    loading: false,
    error: null,
    fetchLands: async (page: number, limit: number) => {
      set({ loading: true, error: null });
      try {
        const response = await api.get(`/land/?limit=${limit}&page=${page}`);
        set({
          lands: response.data.results,
          total: response.data.count,
          loading: false,
        });
      } catch (error: any) {
        set({
          error: error.message || 'Failed to fetch lands',
          loading: false,
        });
      }
    },
  }));
