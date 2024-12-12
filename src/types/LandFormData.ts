export interface LandFormData {
    district: string;
    title: string;
    category: 'land';
    action_type: 'rent' | 'sale';
    description?: string;
    comment?: string;
    price: number;
    rooms: number;
    square_area: number;
    live_square_area: number;
    floor_number: number;
    location: 'city' | 'suburb' | 'countryside' | 'along_road' | 'near_pond' | 'foothills' | 'cottage_area' | 'closed_area';
    furnished?: boolean;
    house_condition: 'euro' | 'normal' | 'repair';
    current_status?: 'free' | 'soon' | 'busy';
    parking_place: boolean;
    agent_percent: number;
    agent_commission?: number;
    crm_id?: string;
    responsible?: string;
  }
  
  