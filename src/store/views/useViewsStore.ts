import {create} from "zustand";
import api from "@/lib/api";

interface IViewStore {
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
}

interface ViewsStore {
    views: IViewStore[];
    error: string;
    loading: boolean;
    fetchViews: () => void;
}

export const useViewsStore = create<ViewsStore>((set) => ({
    views: [],
    error: "",
    loading: false,
    fetchViews: async () => {
        try {
            const response = await api.get('/views');
            set({views: response.data});
        } catch (error) {
            console.error(error);
        }
    }
}));