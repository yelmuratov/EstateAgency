export interface Deal {
    date: string
    id: number
    action_type: string
    object_price: number
    agent_percent: number
    updated_at: string
    crm_id: string
    responsible: string
    commission: number
    created_at: string
  }
  
  export interface View {
    id: number
    date: string
    district: string
    commission: number
    status_deal: boolean
    client_number: string
    created_at: string
    time: string
    action_type: string
    responsible: string
    price: number
    agent_percent: number
    crm_id: string
    owner_number: string
    updated_at: string
  }
  
  export interface Client {
    client_name: string
    id: number
    action_type: string
    district: string[]
    client_status: 'hot' | 'cold'
    created_at: string
    responsible: string
    date: string
    budget: number
    comment: string
    deal_status: string | null
    updated_at: string
  }
  
  export interface AccountingData {
    deals: Deal[]
    deals_count: number
    views: View[]
    views_count: number
    clients: Client[]
    clients_count: number
    commission_count: number
    hot_count: number
    cold_count: number
    all_objects: number
  }
  
  export interface AccountingStore {
    data: Deal[]
    statistics: {
      transactions: number
      views: number
      income: number
      activeClients: number
      coldClients: number
      savedObjects: number
      totalClients: number
      performance: number
      metrics: Record<string, number>
    }
    loading: boolean
    error: string | null
    fetchData: (params?: Record<string, string>) => Promise<void>
  }
  
  