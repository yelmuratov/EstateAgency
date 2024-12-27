import { create } from "zustand";
import api from "@/lib/api";

export interface ViewFormData {
    action_type: string;
    responsible: string;
    date: string;
    time: string;
    district: string;
    price: number;
    commission: number;
    agent_percent: number;
    status_deal: boolean;
    crm_id: string;
    client_number: string;
    owner_number: string;
    id?: number;
    created_at?: string;
    updated_at?: string;
}

export interface ViewStore {
    views: ViewFormData[];
    error: string;
    loading: boolean;
    postView: (view: ViewFormData) => Promise<void>;
    fetchViews: (type: string, page: number, limit: number) => Promise<{ views: ViewFormData[]; total: number }>;
    deleteView: (id: number) => Promise<void>;
    updateView: (viewId: number, view: ViewFormData) => Promise<void>;
    fetchViewById: (id: number) => Promise<ViewFormData | null>;
}

export const useViewStore = create<ViewStore>((set) => ({
    views: [],
    error: "",
    loading: false,
    postView: async (view: ViewFormData) => {
        set({ loading: true });
        try {
            await api.post("/views", view);
            set((state) => ({
                views: [...state.views, view],
                loading: false,
                error: "",
            }));
        } catch (error) {
            const apiError = error as {
                message?: string;
                response?: { data?: { detail?: string } };
            };
            set({
                error: apiError.response?.data?.detail || apiError.message || "Failed to post view",
                loading: false,
            });
            throw error;
        }
    },
    fetchViews: async (type: string, page: number = 1, limit: number = 10) => {
        set({ loading: true });
        try {
            const response = await api.get(`/views?action_type=${type}&page=${page}&limit=${limit}`);
            const views = response.data.data; // Ensure this matches the actual response structure
            const total = response.data.total_count;
            set({
                views,
                loading: false,
                error: "",
            });
            return {
                views,
                total,
            };
        } catch (error) {
            const apiError = error as {
                message?: string;
                response?: { data?: { detail?: string } };
            };
            set({
                error: apiError.response?.data?.detail || apiError.message || "Failed to fetch views",
                loading: false,
            });
            return { views: [], total: 0 };
        }
    },
    deleteView: async (id: number) => {
        set({ loading: true, error: "" });
        try {
            await api.delete(`/views/${id}`);
            set((state) => ({
                views: state.views.filter((view) => view.id !== id),
                loading: false,
            }));
        } catch (error) {
            const apiError = error as {
                message?: string;
                response?: { data?: { detail?: string } };
            };
            set({
                error: apiError.response?.data?.detail || apiError.message || "Failed to delete view",
                loading: false,
            });
        }
    },
    updateView: async (viewId: number, view: ViewFormData) => {
        set({ loading: true, error: "" });
        try {
            await api.put(`/views/${viewId}`, view);
            set((state) => ({
                views: state.views.map((v) => (v.id === viewId ? view : v)),
                loading: false,
                error: "",
            }));
        } catch (error) {
            const apiError = error as {
                message?: string;
                response?: { data?: { detail?: string } };
            };
            set({
                error: apiError.response?.data?.detail || apiError.message || "Failed to update view",
                loading: false,
            });
        }
    },
    fetchViewById: async (id: number) => {
        set({ loading: true, error: "" });
        try {
            const response = await api.get(`/views/${id}`);
            const view = response.data;
            set({ loading: false, error: "" });
            return view;
        } catch (error) {
            const apiError = error as {
                message?: string;
                response?: { data?: { detail?: string } };
            };
            set({
                error: apiError.response?.data?.detail || apiError.message || "Failed to fetch view",
                loading: false,
            });
            return null;
        }
    },
}));
