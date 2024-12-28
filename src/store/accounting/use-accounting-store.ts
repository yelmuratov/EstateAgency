import api from "@/lib/api";
import { create } from "zustand";

export interface Deal {
  date: string;
  id: number;
  action_type: string;
  object_price: number;
  agent_percent: number;
  updated_at: string;
  crm_id: string;
  responsible: string;
  commission: number;
  created_at: string;
  monthly_data: MonthlyData[];
}

export interface View {
  id: number;
  date: string;
  district: string;
  commission: number;
  status_deal: boolean;
  client_number: string;
  created_at: string;
  time: string;
  action_type: string;
  responsible: string;
  price: number;
  agent_percent: number;
  crm_id: string;
  owner_number: string;
  updated_at: string;
}

export interface Client {
  client_name: string;
  id: number;
  action_type: string;
  district: string[];
  client_status: 'hot' | 'cold';
  created_at: string;
  responsible: string;
  date: string;
  budget: number;
  comment: string;
  deal_status: string | null;
  updated_at: string;
}

interface Statistics {
  transactions: number;
  views: number;
  income: number;
  activeClients: number;
  coldClients: number;
  savedObjects: number;
  totalClients: number;
  performance: number;
  metrics: {
    deals: number;
    views: number;
    objects: number;
    clients: number;
  };
  monthlyData: MonthlyData[];
  lastUpdated: string; // Add this line
}

interface MonthlyData {
  month: string;
  rent: number;
  sale: number;
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

export interface ApiResponse {
  deals: Deal[];
  deals_count: number;
  views: View[];
  views_count: number;
  clients: Client[];
  clients_count: number;
  commission_count: number;
  hot_count: number;
  cold_count: number;
  all_objects: number;
  monthly_data: MonthlyData[];
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
    lastUpdated: '',
    views: 0,
    income: 0,
    activeClients: 0,
    coldClients: 0,
    savedObjects: 0,
    totalClients: 0,
    performance: 0,
    metrics: {
      deals: 0,
      views: 0,
      objects: 0,
      clients: 0,
    },
    monthlyData: [],
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

      const response = await api.get<ApiResponse>(`/accounting/overall_data?${queryParams}`);
      const data = response.data;

      // Transform the API response into the expected AccountingData format
      const transformedData: AccountingData[] = data.deals.map(deal => ({
        id: deal.id,
        date: deal.date,
        responsible: deal.responsible,
        action_type: deal.action_type,
        total_amount: deal.object_price,
        commission: deal.commission,
        status: 'completed',
      }));


      // Calculate statistics from the API response
      const statistics: Statistics = {
        transactions: data.deals_count,
        views: data.views_count,
        income: data.commission_count,
        activeClients: data.hot_count,
        coldClients: data.cold_count,
        savedObjects: data.all_objects,
        totalClients: data.clients_count,
        performance: Math.round((data.hot_count / data.clients_count) * 100) || 0,
        lastUpdated: new Date().toISOString(), // Ensure valid date string
        metrics: {
          deals: data.deals_count,
          views: data.views_count,
          objects: data.all_objects,
          clients: data.clients_count,
        },
        monthlyData: data.monthly_data,
      };

      set({
        data: transformedData,
        statistics,
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

