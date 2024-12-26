export interface IData {
  id: number;
  crm_id: string;
  district: string;
  metro_st: string;
  title: string;
  category: string;
  action_type: string;
  description: string;
  comment: string;
  price: number;
  house_type: string;
  rooms: number;
  square_area: number;
  floor_number: number;
  floor: number;
  bathroom: string;
  furnished: boolean;
  house_condition: string;
  current_status: string;
  name: string;
  phone_number: string;
  responsible: string;
  agent_percent: number;
  agent_commission: number;
  created_at: string;
  updated_at: string;
}

export interface IChangeLog {
  operation: string;
  after_data: IData | null;
  updated_at: string;
  before_data: IData | null;
  id: number;
  table_name: string;
  user: string;
  created_at: string;
}

export interface LoginInfo {
  id: number;
  email: string;
  login_at: string;
  phone: string;
  user_id: number;
}

export type ClientStatus = 'hot' | 'cold';
export type DealStatus = 'initial' | 'negotiation' | 'decision' | 'contract' | 'deal';
export type PropertyType = 'rent' | 'sale';

export interface PropertyFormData {
  realtorName: string;  
  clientName: string;
  date: string;
  districts: string[]; // Changed from district to districts array
  budget: number;
  clientStatus: ClientStatus;
  comments?: string;
  dealStatus?: DealStatus;
  type: PropertyType;
}



