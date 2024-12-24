import { create } from "zustand";
import api from "@/lib/api";

interface Metro {
  name: string;
  id: number;
  created_at: string;
  updated_at: string;
}

interface District {
  name: string;
  id: number;
  created_at: string;
  updated_at: string;
}

interface StoreState {
  metros: Metro[];
  districts: District[];
  loading: boolean;
  error: string | null;
  fetchMetros: () => Promise<void>;
  fetchDistricts: () => Promise<void>;
  deleteMetro: (metroId: number) => Promise<void>;
  deleteDistrict: (districtId: number) => Promise<void>;
  updateMetro: (metroId: number, name: string) => Promise<void>;
  upadteDistrict: (districtId: number, name: string) => Promise<void>;
  createMetro: (name: string) => Promise<void>;
  createDistrict: (name: string) => Promise<void>;
}

const usePropertyStore = create<StoreState>((set) => ({
  metros: [],
  districts: [],
  loading: false,
  error: null,
  fetchMetros: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<Metro[]>("/metro/");
      set({ metros: response.data, loading: false });
    } catch (error) {
      // Define the type for the error object
      const apiError = error as {
        message?: string;
        response?: {
          data?: {
            detail?: string;
          };
        };
      };
  
      set({
        error: apiError.response?.data?.detail || apiError.message || "Failed to fetch metros",
        loading: false,
      });
    }
  },
  fetchDistricts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<District[]>("/district/");
      set({ districts: response.data, loading: false });
    } catch (error) {
      // Define the type for the error object
      const apiError = error as {
        message?: string;
        response?: {
          data?: {
            detail?: string;
          };
        };
      };
  
      set({
        error: apiError.response?.data?.detail || apiError.message || "Failed to fetch districts",
        loading: false,
      });
    }
  },  
  deleteMetro: async (metroId: number) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/metro/${metroId}/`);
      set((state) => ({
        metros: state.metros.filter((metro) => metro.id !== metroId),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : "Failed to delete metro station" });
      throw error;
    }
  },
  updateMetro: async (metroId: number, name: string) => {
    set({ loading: true, error: null });
    try {
      await api.patch(`/metro/${metroId}/`, { name });
      set((state) => ({
        metros: state.metros.map((metro) =>
          metro.id === metroId ? { ...metro, name } : metro
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : "Failed to update metro station" });
      throw error;
    }
  },
  deleteDistrict: async (districtId: number) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/district/${districtId}/`);
      set((state) => ({
        districts: state.districts.filter((district) => district.id !== districtId),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : "Failed to delete district" });
      throw error;
    }
  },
  upadteDistrict: async (districtId: number, name: string) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/district/${districtId}/`, { name });
      set((state) => ({
        districts: state.districts.map((district) =>
          district.id === districtId ? { ...district, name } : district
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : "Failed to update district" });
      throw error;
    }
  },
  createMetro: async (name: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<Metro>("/metro/", { name });
      set((state) => ({
        metros: [...state.metros, response.data],
        loading: false,
      }));
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: {
          data?: {
            detail?: string;
          };
        };
      };
      set({
        error: apiError.response?.data?.detail || apiError.message || "Failed to create metro",
        loading: false,
      });
      throw error;
    }
  },
  createDistrict: async (name: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<District>("/district/", { name });
      set((state) => ({
        districts: [...state.districts, response.data],
        loading: false,
      }));
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: {
          data?: {
            detail?: string;
          };
        };
      };
      set({
        error: apiError.response?.data?.detail || apiError.message || "Failed to create district",
        loading: false,
      });
      throw error;
    }
  }
}));

export default usePropertyStore;
