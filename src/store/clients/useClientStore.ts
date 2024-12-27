import {create} from "zustand";
import api from "@/lib/api";
import {PropertyFormData} from "@/types/property";

interface ClientStore {
    clients: PropertyFormData[];
    error: string;
    loading: boolean;
    postClient: (client: PropertyFormData) => Promise<void>;
    fetchClients: (type: string) => Promise<{ clients: PropertyFormData[]; total: number }>;
    deleteClient: (id: number) => Promise<void>;
    updateClient: (client: PropertyFormData) => Promise<void>;
    fetchClientById: (id: number) => Promise<PropertyFormData | null>; // Add fetchClientById method
}

export const useClientStore = create<ClientStore>((set) => ({
    clients: [],
    error: "",
    loading: false,
    postClient: async (client: PropertyFormData) => {
        set({loading: true});
        try {
            await api.post("/clients", client);
            set((state) => ({
                clients: [...state.clients, client],
                loading: false,
                error: "",
            }));
        } catch (error) {
            const apiError = error as {
              message?: string;
              response?: { data?: { detail?: string } };
            };
            set({
                error: apiError.response?.data?.detail || apiError.message || "Failed to post client",
                loading: false
            });
            throw error;
        }
    },
    fetchClients: async (type: string) => {
        set({loading: true});
        try {
            const response = await api.get(`/clients?action_type=${type}`);
            const clients = response.data.data; // Ensure this matches the actual response structure
            const total = response.data.total_count;
            set({
                clients,
                loading: false,
                error: "",
            });
            return {
                clients,
                total,
            };
        } catch (error) {
            const apiError = error as {
              message?: string;
              response?: { data?: { detail?: string } };
            };
            set({
                error: apiError.response?.data?.detail || apiError.message || "Failed to fetch clients",
                loading: false
            });
            return { clients: [], total: 0 };
        }
    },
    deleteClient: async (id: number) => {
        set({ loading: true, error: "" });
        try {
            await api.delete(`/clients/${id}`);
            set((state) => ({
                clients: state.clients.filter((client) => client.id !== id),
                loading: false,
            }));
        } catch (error) {
            const apiError = error as {
                message?: string;
                response?: { data?: { detail?: string } };
            };
            set({
                error: apiError.response?.data?.detail || apiError.message || "Failed to delete client",
                loading: false,
            });
        }
    },
    updateClient: async (client: PropertyFormData) => {
        set({ loading: true, error: "" });
        try {
            await api.put(`/clients/${client.id}`, client);
            set((state) => ({
                clients: state.clients.map((c) => (c.id === client.id ? client : c)),
                loading: false,
                error: "",
            }));
        } catch (error) {
            const apiError = error as {
                message?: string;
                response?: { data?: { detail?: string } };
            };
            set({
                error: apiError.response?.data?.detail || apiError.message || "Failed to update client",
                loading: false,
            });
        }
    },
    fetchClientById: async (id: number) => { // Implement fetchClientById method
        set({ loading: true, error: "" });
        try {
            const response = await api.get(`/clients/${id}`);
            const client = response.data;
            set({ loading: false, error: "" });
            return client;
        } catch (error) {
            const apiError = error as {
                message?: string;
                response?: { data?: { detail?: string } };
            };
            set({
                error: apiError.response?.data?.detail || apiError.message || "Failed to fetch client",
                loading: false,
            });
            return null;
        }
    },
}));
