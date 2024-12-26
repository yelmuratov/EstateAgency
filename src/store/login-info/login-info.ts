import {create} from "zustand";
import api from "@/lib/api";
import {LoginInfo} from "@/types/property";

interface LoginInfoStore {
  loginInfo: LoginInfo[];
  loading: boolean;
  error: string | null;
  fetchLoginInfo: (page: number, limit: number) => Promise<{ data: LoginInfo[]; total: number }>;
}

const useLoginInfoStore = create<LoginInfoStore>((set) => ({
  loginInfo: [],
  loading: false,
  error: null,
  fetchLoginInfo: async (page: number, limit: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/auth/login_info/?limit=${limit}&page=${page}`);
      const data = response.data; // Corrected this line to directly access response.data
      set({
        loginInfo: data,
        loading: false,
      });
      return {
        data: data.data as LoginInfo[],
        total: data.total_count as number,
      };
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
        error:
          apiError.response?.data?.detail || apiError.message || "Failed to fetch login info",
        loading: false,
      });
      return {
        data: [],
        total: 0,
      };
    }
  }
}));

export default useLoginInfoStore;