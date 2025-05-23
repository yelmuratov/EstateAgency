import api from "@/lib/api"
import { create } from "zustand"

interface Media {
  media_type: string
  updated_at: string
  apartment_id: number
  id: number
  url: string
  created_at: string
}

interface Apartment {
  id: number
  title: string
  rooms: number
  square_area: number
  agent_percent: number
  agent_commission: number
  second_agent_commission: number
  action_type: string
  location: string
  created_at: string
  crm_id: string
  description: string
  category: string
  furnished: boolean
  updated_at: string
  comment: string
  house_condition: string
  house_type: string
  price: number
  current_status: string
  district: string
  responsible: string
  floor_number: number
  floor: number
  name: string
  phone_number: string
  bathroom: string
  media: Media[]
  metro_st: string
  second_responsible: string
  second_agent_percent: number
  status_date: string
}

interface ApartmentStore {
  apartments: Apartment[]
  filteredApartments: Apartment[] // Add this state
  searchedApartments: Apartment[] // Add this state
  total: number
  loading: boolean
  error: string | null
  searchError: string | null
  searchLoading: boolean
  filterError: string | null
  isSearching: boolean // Add this flag
  currentPage: number // Add this state
  setCurrentPage: (page: number) => void // Add this action
  currentFilters: Record<string, string> // Add this state
  setFilters: (filters: Record<string, string>) => void // Add this action
  fetchApartments: (page: number, limit: number) => Promise<void>
  fetchApartmentById: (id: number) => Promise<Apartment | null>
  hydrateApartments: (apartments: Apartment[], total: number) => void // SSR Hydration
  searchApartments: (query: string) => Promise<void>
  filterApartments: (filters: Record<string, string>) => Promise<void>
  deleteApartment: (id: number) => Promise<void>
}

export const useApartmentStore = create<ApartmentStore>((set, get) => ({
  apartments: [],
  filteredApartments: [], // Initialize the state
  searchedApartments: [], // Initialize the state
  total: 0,
  loading: false,
  error: null,
  searchError: null,
  searchLoading: false,
  filterError: null,
  isSearching: false, // Initialize the flag
  currentPage: 1, // Initialize the state
  currentFilters: {}, // Initialize the state
  setCurrentPage: (page: number) => set({ currentPage: page }), // Define the action
  setFilters: (filters: Record<string, string>) => set({ currentFilters: filters }), // Define the action

  fetchApartments: async (page: number, limit: number) => {
    const { isSearching } = get()
    if (isSearching) return

    set({ loading: true, error: null })
    try {
      const response = await api.get(`/apartment/?limit=${limit}&page=${page}`)
      set({
        apartments: Array.isArray(response.data.data) ? response.data.data : [], // Use `data` key
        total: response.data.total_count || 0, // Use `total_count` key
        loading: false,
        currentPage: page, // Update the current page in the store
      })
    } catch (error) {
      const apiError = error as {
        message?: string
        response?: { data?: { detail?: string } }
      }
      set({
        error: apiError.response?.data?.detail || apiError.message || "Failed to fetch apartments",
        loading: false,
        apartments: [], // Reset to an empty array in case of error
      })
    }
  },
  searchApartments: async (query: string) => {
    if (query.trim() === "") {
      set({ searchedApartments: [] })
      return
    }
    set({ searchLoading: true, searchError: null, isSearching: true })
    try {
      const response = await api.get(`/additional/search/?text=${query}&table=apartment`)
      set({
        searchedApartments: Array.isArray(response.data) ? response.data : [],
        searchLoading: false,
        isSearching: false,
      })
    } catch (error) {
      const apiError = error as {
        message?: string
        response?: { data?: { detail?: string } }
      }
      set({
        searchError: apiError.response?.data?.detail || apiError.message || "Failed to fetch apartments",
        searchLoading: false,
        isSearching: false,
        searchedApartments: [], // Reset to an empty array in case of error
      })
    }
  },
  fetchApartmentById: async (id: number) => {
    const { apartments } = get()

    // Check if the apartment is already in the store
    const cachedApartment = apartments.find((apt) => apt.id === id)
    if (cachedApartment) {
      return cachedApartment
    }

    try {
      const response = await api.get(`/apartment/${id}`)
      return response.data
    } catch (error) {
      const apiError = error as {
        message?: string
        response?: { data?: { detail?: string } }
      }
      set({
        error: apiError.response?.data?.detail || apiError.message || "Failed to fetch apartment",
        loading: false,
      })
      return null
    }
  },
  hydrateApartments: (apartments, total) => {
    set({
      apartments,
      total,
      loading: false,
    })
  },
  filterApartments: async (filters) => {
    set({ loading: true, filterError: null, currentFilters: filters })
    try {
      const response = await api.get(`/additional/filter`, {
        params: {
          ...filters,
          page: filters.page || "1", // Ensure page is always present
          limit: filters.limit || "15", // Ensure limit is always present
        },
      })
      set({
        filteredApartments: Array.isArray(response.data.objects) ? response.data.objects : [],
        total: response.data.filtered_count || 0,
        loading: false,
        currentPage: Number.parseInt(filters.page || "1"), // Update current page
      })
    } catch (error) {
      const apiError = error as {
        message?: string
        response?: { data?: { detail?: string } }
      }
      set({
        filterError: apiError.response?.data?.detail || apiError.message || "Failed to fetch apartments",
        loading: false,
        filteredApartments: [],
      })
    }
  },
  deleteApartment: async (id: number) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/apartment/${id}`)
      set((state) => ({
        apartments: state.apartments.filter((apartment) => apartment.id !== id),
        filteredApartments: state.filteredApartments.filter((apartment) => apartment.id !== id),
        searchedApartments: state.searchedApartments.filter((apartment) => apartment.id !== id),
        loading: false,
      }))
    } catch (error) {
      const apiError = error as {
        message?: string
        response?: { data?: { detail?: string } }
      }
      set({
        error: apiError.response?.data?.detail || apiError.message || "Failed to delete apartment",
        loading: false,
      })
    }
  },
}))

