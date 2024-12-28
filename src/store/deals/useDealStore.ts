import { create } from "zustand";
import api from "@/lib/api";
import { Deal } from "@/types/deal";

interface DealStore {
    deals: Deal[];
    error: string;
    loading: boolean;
    fetchDeals: (type: string, page?: number, perPage?: number) => Promise<{ deals: Deal[]; total: number }>;
    deleteDeal: (id: number) => Promise<void>;
    fetchDealById: (id: number) => Promise<Deal | null>;
}

export const useDealStore = create<DealStore>((set) => ({
    deals: [],
    error: "",
    loading: false,
    fetchDeals: async (type: string, page: number = 1, perPage: number = 15) => {
        set({ loading: true });
        try {
            const response = await api.get(`/deals/?action_type=${type}&page=${page}&per_page=${perPage}`);
            const deals = response.data.data;
            const total = response.data.total_count;
            set({
                deals,
                loading: false,
                error: "",
            });
            return {
                deals,
                total,
            };
        } catch (error) {
            const apiError = error as {
                message?: string;
                response?: { data?: { detail?: string } };
            };
            set({
                error: apiError.response?.data?.detail || apiError.message || "Failed to fetch deals",
                loading: false,
            });
            return { deals: [], total: 0 };
        }
    },
    deleteDeal: async (id: number) => {
        set({ loading: true, error: "" });
        try {
            await api.delete(`/deals/${id}`);
            set((state) => ({
                deals: state.deals.filter((deal) => deal.id !== id),
                loading: false,
            }));
        } catch (error) {
            const apiError = error as {
                message?: string;
                response?: { data?: { detail?: string } };
            };
            set({
                error: apiError.response?.data?.detail || apiError.message || "Failed to delete deal",
                loading: false,
            });
        }
    },
    fetchDealById: async (id: number) => {
        set({ loading: true, error: "" });
        try {
            const response = await api.get(`/deals/${id}`);
            const deal = response.data;
            set({ loading: false, error: "" });
            return deal;
        } catch (error) {
            const apiError = error as {
                message?: string;
                response?: { data?: { detail?: string } };
            };
            set({
                error: apiError.response?.data?.detail || apiError.message || "Failed to fetch deal",
                loading: false,
            });
            return null;
        }
    },
}));
