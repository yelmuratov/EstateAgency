"use client"

import { useState, useEffect } from "react"
import usePropertyStore from "@/store/MetroDistrict/propertyStore"
import { useApartmentStore } from "@/store/apartment/aparmentStore"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface PropertyFilterProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters: (filters: Record<string, string>) => void
}

export function PropertyFilter({
  open,
  onOpenChange,
  onApplyFilters,
}: PropertyFilterProps) {
  const { metros, districts, fetchMetros, fetchDistricts } = usePropertyStore()
  const { filterApartments } = useApartmentStore()

  useEffect(() => {
    fetchMetros()
    fetchDistricts()
  }, [fetchMetros, fetchDistricts])

  const [filters, setFilters] = useState<Record<string, string>>({
    region: "",
    metro: "",
    title: "",
    price: "",
    housingType: "",
    rooms: "",
    area: "",
    totalFloors: "",
    floor: "",
    bathroom: "",
    furnished: "",
    condition: "",
  })

  const handleChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    const params = new URLSearchParams()

    // Use `Set` to ensure uniqueness
    const uniqueFilters = new Set(Object.entries(filters))

    uniqueFilters.forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    
    filterApartments(Object.fromEntries(params.entries())) // Convert to plain object for API usage
    onApplyFilters(Object.fromEntries(uniqueFilters)) // Pass unique filters back
    onOpenChange(false) // Close the modal
  }

  const clearFilters = () => {
    setFilters({
      region: "",
      metro: "",
      title: "",
      price: "",
      housingType: "",
      rooms: "",
      area: "",
      totalFloors: "",
      floor: "",
      bathroom: "",
      furnished: "",
      condition: "",
    })
    filterApartments({}) // Clear all filters from the API
    onApplyFilters({}) // Pass back an empty object
    onOpenChange(false) // Close the modal
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Фильтр недвижимости</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Region and Metro */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Район</Label>
              <Select
                onValueChange={(value) => handleChange("region", value)}
                value={filters.region}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите район" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.name}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Метро</Label>
              <Select
                onValueChange={(value) => handleChange("metro", value)}
                value={filters.metro}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите станцию метро" />
                </SelectTrigger>
                <SelectContent>
                  {metros.map((metro) => (
                    <SelectItem key={metro.id} value={metro.name}>
                      {metro.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label>Название</Label>
            <Input
              placeholder="Проспект Амир Темур 5/5/2"
              value={filters.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          {/* Price */}
          <div>
            <Label>Цена</Label>
            <Input
              type="number"
              placeholder="300000$"
              value={filters.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </div>

          {/* Housing Type */}
          <div>
            <Label>Тип жилья</Label>
            <Select
              onValueChange={(value) => handleChange("housingType", value)}
              value={filters.housingType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_building">Новостройка</SelectItem>
                <SelectItem value="secondary">Вторичка</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rooms */}
          <div>
            <Label>Количество комнат</Label>
            <Input
              placeholder="1/2/3/4/5/6"
              value={filters.rooms}
              onChange={(e) => handleChange("rooms", e.target.value)}
            />
          </div>

          {/* Area */}
          <div>
            <Label>Общая площадь (м²)</Label>
            <Input
              type="number"
              placeholder="200"
              value={filters.area}
              onChange={(e) => handleChange("area", e.target.value)}
            />
          </div>

          {/* Total Floors and Current Floor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Этажность</Label>
              <Input
                type="number"
                placeholder="23"
                value={filters.totalFloors}
                onChange={(e) => handleChange("totalFloors", e.target.value)}
              />
            </div>
            <div>
              <Label>Этаж</Label>
              <Input
                type="number"
                placeholder="10"
                value={filters.floor}
                onChange={(e) => handleChange("floor", e.target.value)}
              />
            </div>
          </div>

          {/* Bathroom */}
          <div>
            <Label>Санузел</Label>
            <Select
              onValueChange={(value) => handleChange("bathroom", value)}
              value={filters.bathroom}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="separated">Раздельный</SelectItem>
                <SelectItem value="combined">Совмещенный</SelectItem>
                <SelectItem value="multiple">2 и более</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Furnished */}
          <div>
            <Label>Меблирован</Label>
            <Select
              onValueChange={(value) => handleChange("furnished", value)}
              value={filters.furnished}
            >
              <SelectTrigger>
                <SelectValue placeholder="Да/Нет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Да</SelectItem>
                <SelectItem value="no">Нет</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Condition */}
          <div>
            <Label>Состояние</Label>
            <Select
              onValueChange={(value) => handleChange("condition", value)}
              value={filters.condition}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите состояние" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="euro">Евроремонт</SelectItem>
                <SelectItem value="normal">Среднее</SelectItem>
                <SelectItem value="needs_repair">Требует ремонта</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button variant="secondary" onClick={clearFilters}>
            Очистить фильтры
          </Button>
          <Button onClick={handleSubmit}>Применить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

