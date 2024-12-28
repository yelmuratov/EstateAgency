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
}

export interface DealResponse {
    data: Deal[];
    total_count: number;
}