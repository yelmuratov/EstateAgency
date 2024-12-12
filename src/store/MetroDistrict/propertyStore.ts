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
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch metros", loading: false });
    }
  },
  fetchDistricts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<District[]>("/district/");
      set({ districts: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch districts", loading: false });
    }
  },
}));

export default usePropertyStore;
