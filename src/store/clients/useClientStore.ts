import {create} from "zustand";
import api from "@/lib/api";

interface IClient {
    client_name: string;
    id: number;
    action_type: string;
    district: string[];
    client_status: string;
    created_at: string;
    responsible: string;
    date: string;
    budget: number;
    comment: string;
    deal_status: string | null;
    updated_at: string;
}

interface ClientStore {
    clients: IClient[];
    error: string;
    loading: boolean;
    postClient: (client: IClient) => Promise<void>;
    fetchClients: () => Promise<IClient[]>;
}

export const useClientStore = create<ClientStore>((set) => ({
    clients: [],
    error: "",
    loading: false,
    postClient: async (client: IClient) => {
        set({loading: true});
        try {
            await api.post("/clients", client);
            set({clients: [client], loading: false});
        } catch (error) {
            const apiError = error as {
              message?: string;
              response?: { data?: { detail?: string } };
            };
            set({
                error: apiError.response?.data?.detail || apiError.message || "Failed to post client",
                loading: false
            });
        }
    },
    fetchClients: async () => {
        set({loading: true});
        try {
            const response = await api.get("/clients");
            return response.data;
        } catch (error) {
            const apiError = error as {
              message?: string;
              response?: { data?: { detail?: string } };
            };
            set({
                error: apiError.response?.data?.detail || apiError.message || "Failed to fetch clients",
                loading: false
            });
        }
    },
}));
