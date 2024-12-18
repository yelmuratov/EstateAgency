"use client";

import { useState, useEffect } from "react";
import usePropertyStore from "@/store/MetroDistrict/propertyStore";
import { useApartmentStore } from "@/store/apartment/aparmentStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertyFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: Record<string, string>) => void;
}

export function PropertyFilter({
    open,
    onOpenChange,
    onApplyFilters,
  }: PropertyFilterProps) {
    const { metros, districts, fetchMetros, fetchDistricts } = usePropertyStore();
    const { filterApartments } = useApartmentStore();
  
    useEffect(() => {
      fetchMetros();
      fetchDistricts();
    }, [fetchMetros, fetchDistricts]);
  
    const [filters, setFilters] = useState<Record<string, string>>({
      table: "apartment",
      district: "",
      metro_st: "",
      furniture: "",
      bathroom: "",
      price_min: "",
      price_max: "",
      room_min: "",
      room_max: "",
      area_min: "",
      area_max: "",
      floor_min: "",
      floor_max: "",
      responsible: "",
    });
  
    const handleChange = (name: string, value: string) => {
      setFilters((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = () => {
      // Filter out empty fields
      const changedFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value.trim() !== "")
      );      
  
      filterApartments(changedFilters); // Send only changed filters
      onApplyFilters(changedFilters); // Pass filters back to parent component
      onOpenChange(false); // Close modal
    };
  
    const clearFilters = () => {
      setFilters({
        table: "apartment",
        district: "",
        metro_st: "",
        furniture: "",
        bathroom: "",
        price_min: "",
        price_max: "",
        room_min: "",
        room_max: "",
        area_min: "",
        area_max: "",
        floor_min: "",
        floor_max: "",
        responsible: "",
      });
      filterApartments({ table: "apartment" }); // Reset with table filter
      onApplyFilters({ table: "apartment" }); // Reset to base state
      onOpenChange(false);
    };
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Фильтр недвижимости</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* District and Metro */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Район</Label>
                <Select
                  onValueChange={(value) => handleChange("district", value)}
                  value={filters.district}
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
                  onValueChange={(value) => handleChange("metro_st", value)}
                  value={filters.metro_st}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите метро" />
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
  
            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Цена от</Label>
                <Input
                  type="number"
                  placeholder="Минимальная цена"
                  value={filters.price_min}
                  onChange={(e) => handleChange("price_min", e.target.value)}
                />
              </div>
              <div>
                <Label>Цена до</Label>
                <Input
                  type="number"
                  placeholder="Максимальная цена"
                  value={filters.price_max}
                  onChange={(e) => handleChange("price_max", e.target.value)}
                />
              </div>
            </div>
  
            {/* Room Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Комнат от</Label>
                <Input
                  type="number"
                  placeholder="Минимум комнат"
                  value={filters.room_min}
                  onChange={(e) => handleChange("room_min", e.target.value)}
                />
              </div>
              <div>
                <Label>Комнат до</Label>
                <Input
                  type="number"
                  placeholder="Максимум комнат"
                  value={filters.room_max}
                  onChange={(e) => handleChange("room_max", e.target.value)}
                />
              </div>
            </div>
  
            {/* Area Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Площадь от (м²)</Label>
                <Input
                  type="number"
                  placeholder="Минимальная площадь"
                  value={filters.area_min}
                  onChange={(e) => handleChange("area_min", e.target.value)}
                />
              </div>
              <div>
                <Label>Площадь до (м²)</Label>
                <Input
                  type="number"
                  placeholder="Максимальная площадь"
                  value={filters.area_max}
                  onChange={(e) => handleChange("area_max", e.target.value)}
                />
              </div>
            </div>
  
            {/* Floor Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Этаж от</Label>
                <Input
                  type="number"
                  placeholder="Минимальный этаж"
                  value={filters.floor_min}
                  onChange={(e) => handleChange("floor_min", e.target.value)}
                />
              </div>
              <div>
                <Label>Этаж до</Label>
                <Input
                  type="number"
                  placeholder="Максимальный этаж"
                  value={filters.floor_max}
                  onChange={(e) => handleChange("floor_max", e.target.value)}
                />
              </div>
            </div>
  
            {/* Furniture */}
            <div>
              <Label>Мебель</Label>
              <Select
                onValueChange={(value) => handleChange("furniture", value)}
                value={filters.furniture}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Есть или нет мебели" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Да</SelectItem>
                  <SelectItem value="false">Нет</SelectItem>
                </SelectContent>
              </Select>
            </div>
  
            {/* Bathroom */}
            <div>
              <Label>Санузел</Label>
              <Select
                onValueChange={(value) => handleChange("bathroom", value)}
                value={filters.bathroom}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип санузла" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="separated">Раздельный</SelectItem>
                  <SelectItem value="combined">Совмещенный</SelectItem>
                  <SelectItem value="many">Много</SelectItem>
                </SelectContent>
              </Select>
            </div>
  
            {/* Responsible */}
            <div>
              <Label>Ответственный</Label>
              <Input
                placeholder="Имя ответственного"
                value={filters.responsible}
                onChange={(e) => handleChange("responsible", e.target.value)}
              />
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
    );
  }
  
  
