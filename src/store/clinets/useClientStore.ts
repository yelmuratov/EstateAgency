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
    fetchClients: () => void;
}

export const useClientStore = create<ClientStore>((set) => ({
    clients: [],
    error: "",
    loading: false,
    fetchClients: async () => {
        try {
            const response = await api.get('/clients');
            console.log(response.data);
            set({clients: response.data});
        } catch (error) {
            console.error(error);
        }
    }
}));
