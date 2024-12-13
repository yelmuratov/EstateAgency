import api from "@/lib/api";
import {create} from "zustand";

interface Media {
  url: string;
  apartment_id: number;
  updated_at: string;
  media_type: string;
  id: number;
  created_at: string;
}

interface Apartment {
  id: number;
  title: string;
  house_type: string;
  current_status: string;
  category: string;
  rooms: number;
  name: string;
  square_area: number;
  phone_number: string;
  crm_id: string;
  action_type: string;
  floor_number: number;
  responsible: string;
  floor: number;
  agent_percent: number;
  description: string;
  bathroom: string;
  agent_commission: number;
  district: string;
  comment: string;
  furnished: boolean;
  created_at: string;
  house_condition: string;
  metro_st: string;
  price: number;
  updated_at: string;
  media: Media[];
}

interface ApartmentStore {
    apartments: Apartment[];
    total: number;
    loading: boolean;
    error: string | null;
    fetchApartments: (page: number, limit: number) => Promise<void>;
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
          apartments: response.data.results,
          total: response.data.count,
          loading: false,
        });
      } catch (error: any) {
        set({
          error: error.message || 'Failed to fetch apartments',
          loading: false,
        });
      }
    },
  }));
