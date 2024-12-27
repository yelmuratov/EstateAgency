import api from "@/lib/api";
import { create } from "zustand";

interface Statistics {
  transactions: number;
  views: number;
  calls: number;
  income: number;
  activeClients: number;
  coldClients: number;
  savedObjects: number;
  totalClients: number;
  performance: number;
  metrics: {
    deals: number;
    calls: number;
    views: number;
    objects: number;
    clients: number;
  };
}

interface AccountingData {
  id: number;
  date: string;
  responsible: string;
  action_type: string;
  total_amount: number;
  commission: number;
  status: string;
}

interface AccountingStore {
  data: AccountingData[];
  statistics: Statistics;
  loading: boolean;
  error: string | null;
  fetchData: (params: {
    action_type?: string;
    start_date?: string;
    end_date?: string;
    date?: string;
    responsible?: string;
  }) => Promise<void>;
}

export const useAccountingStore = create<AccountingStore>((set) => ({
  data: [],
  statistics: {
    transactions: 0,
    views: 0,
    calls: 0,
    income: 0,
    activeClients: 0,
    coldClients: 0,
    savedObjects: 0,
    totalClients: 0,
    performance: 0,
    metrics: {
      deals: 0,
      calls: 0,
      views: 0,
      objects: 0,
      clients: 0,
    },
  },
  loading: false,
  error: null,

  fetchData: async (params) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const [dataResponse, statsResponse] = await Promise.all([
        api.get(`/accounting/overall_data?${queryParams}`),
        api.get(`/accounting/statistics?${queryParams}`),
      ]);

      set({
        data: Array.isArray(dataResponse.data) ? dataResponse.data : [],
        statistics: statsResponse.data,
        loading: false,
      });
    } catch (error) {
      const apiError = error as {
        message?: string;
        response?: { data?: { detail?: string } };
      };
      set({
        error:
          apiError.response?.data?.detail || apiError.message || "Failed to fetch data",
        loading: false,
        data: [],
      });
    }
  },
}));
