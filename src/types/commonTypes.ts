interface Media {
    id: number;
    url: string;
    media_type: string;
  }
  
  interface PropertyBase {
    id: number;
    title: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    responsible: string;
    status: "free" | "soon" | "busy";
    category: string;
    squareArea: number;
    media: Media[];
  }
  
  export interface Apartment extends PropertyBase {
    houseType: "new_building" | "secondary";
    currentStatus: "free" | "soon" | "busy";
    rooms: number;
    name: string;
    phoneNumber: string;
    floorNumber: number;
    floor: number;
    bathroom: "separated" | "combined" | "many";
    district: string;
    metroStation: string;
  }
  
  export interface Commercial extends PropertyBase {
    rooms: number;
    floorNumber: number;
    location: string;
    parkingPlace: boolean;
  }
  
  export interface Land extends PropertyBase {
    liveSquareArea: number;
    location: string;
    parkingPlace: boolean;
  }
  
  export const statusColors: Record<PropertyBase["status"], string> = {
    free: "bg-green-500",
    soon: "bg-yellow-500",
    busy: "bg-red-500",
  };
  