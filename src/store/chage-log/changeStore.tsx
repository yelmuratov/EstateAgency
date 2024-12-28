import { create } from "zustand";
import api from "@/lib/api";
import axios from "axios";
import { IChangeLog } from "@/types/property";

interface ChangeStoreState {
  changeLogs: IChangeLog[];
  total: number;
  error: string;
  loading: boolean;
  fetchChangeLogs: (page: number, limit: number) => Promise<{ data: IChangeLog[]; total: number } | undefined>;
}

const useChangeStore = create<ChangeStoreState>((set) => ({
  changeLogs: [],
  total: 0,
  error: "",
  loading: false,
  fetchChangeLogs: async (page: number, limit: number) => {
    set({ loading: true, error: "" });
    try {
      const response = await api.get(`/changes/?limit=${limit}&page=${page}`);
      set({
        changeLogs: response.data.results || [],
        loading: false,
        total: response.data.total,
      });
    return {
        data:response.data.data as IChangeLog[],
        total:response.data.total_count as number
    }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || error.message,
          loading: false,
        });
      } else {
        set({
          error: "An unexpected error occurred",
          loading: false,
        });
      }
    }
  },
}));

export default useChangeStore;

