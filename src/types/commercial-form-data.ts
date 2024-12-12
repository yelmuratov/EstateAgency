export interface CommercialFormData {
    district: string;
    title: string;
    category: 'commercial';
    action_type: 'rent' | 'sale';
    description?: string;
    comment?: string;
    price: number;
    rooms: number;
    square_area: number;
    floor_number: number;
    location: 'business_center' | 'administrative_building' | 'residential_building' | 'cottage' | 'shopping_mall' | 'industrial_zone' | 'market' | 'detached_building';
    furnished?: boolean;
    house_condition: 'euro' | 'normal' | 'repair';
    current_status?: 'free' | 'soon' | 'busy';
    parking_place: boolean;
    agent_percent: number;
    agent_commission?: number;
    crm_id?: string;
    responsible?: string;
  }
  
  