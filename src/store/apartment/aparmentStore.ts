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
  searchError: string | null;
  searchLoading: boolean;
  filterError: string | null;
  fetchApartments: (page: number, limit: number) => Promise<void>;
  fetchApartmentById: (id: number) => Promise<Apartment | null>;
  hydrateApartments: (apartments: Apartment[], total: number) => void; // SSR Hydration
  searchApartments: (query: string) => Promise<void>;
  filterApartments: (filters: Record<string, string>) => Promise<void>;
}

export const useApartmentStore = create<ApartmentStore>((set, get) => ({
  apartments: [],
  total: 0,
  loading: false,
  error: null,
  searchError: null,
  searchLoading: false,
  filterError: null,

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
      const apiError = error as {
        message?: string;
        response?: { data?: { detail?: string } };
      };
      set({
        error:
          apiError.response?.data?.detail || apiError.message || "Failed to fetch apartments",
        loading: false,
        apartments: [], // Reset to an empty array in case of error
      });
    }
  },
  searchApartments: async (query: string) => {
    set({ searchLoading: true, error: null });
    try {
      const response = await api.get(`/additional/search/?text=${query}&table=apartment`);
      console.log(Array.isArray(response.data) ? response.data : []);
      set({
        apartments: Array.isArray(response.data) ? response.data : [], // Use `data` key
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
        apartments: [], // Reset to an empty array in case of error
      });
    }
  }
  ,
  fetchApartmentById: async (id: number) => {
    const { apartments } = get();

    // Check if the apartment is already in the store
    const cachedApartment = apartments.find((apt) => apt.id === id);
    if (cachedApartment) {
      return cachedApartment;
    }

    try {
      const response = await api.get(`/apartment/${id}`);
      return response.data;
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: { data?: { detail?: string } };
      };
      set({
        error:
          apiError.response?.data?.detail || apiError.message || "Failed to fetch apartment",
        loading: false,
      });
      return null;
    }
  },

  hydrateApartments: (apartments, total) => {
    set({
      apartments,
      total,
      loading: false,
    });
  },
  filterApartments: async (filters) => {
    set({ loading: true, filterError: null });
    try {
      const response = await api.get(`/additional/filter/?table=apartment&${filters}`, {
        params: filters,
      });
      set({
        apartments: Array.isArray(response.data) ? response.data : [], // Use `data` key
        total: Array.isArray(response.data) ? response.data.length : 0, // Use length of apartments array
        loading: false,
      });
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: { data?: { detail?: string } };
      };
      set({
        filterError:
          apiError.response?.data?.detail || apiError.message || "Failed to fetch apartments",
        loading: false,
        apartments: [], // Reset to an empty array in case of error
      });
    }
  }
}));
