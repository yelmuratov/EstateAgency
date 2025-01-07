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
import { UserStore } from "@/store/users/userStore";

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
  type:"rent" | "sale";
}

const BATHROOM_OPTIONS: IBathroom = {
  separated: "Раздельный",
  combined: "Совмещенный",
  many: "Два и более",
};

const STATUS_OPTIONS = {
  free: "Свободно",
  soon: "Скоро освободится",
  busy: "Занято",
};

interface IBathroom {
  separated: string;
  combined: string;
  many: string;
}

export function PropertyFilter({ open, onOpenChange,type }: PropertyFilterProps) {
  const { metros, districts, fetchMetros, fetchDistricts } = usePropertyStore();
  const { filterApartments } = useApartmentStore();
  const { fetchUsers, users } = UserStore();

  console.log(type);

  useEffect(() => {
    fetchMetros();
    fetchDistricts();
    fetchUsers();
  }, [fetchMetros, fetchDistricts, fetchUsers]);

  const [filters, setFilters] = useState<Record<string, string>>({
    table: "apartment",
    action_type: type,
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
    date_min: "",
    date_max: "",
    status_date_min: "",
    status_date_max: "",
  });

  const handleChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const changedFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value.trim() !== "")
    );

    if (Object.keys(changedFilters).length > 1) { // Check if any filters are selected
      filterApartments(changedFilters);
    }
    onOpenChange(false);
  };

  const clearFilters = () => {
    setFilters({
      table: "apartment",
      action_type: type,
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
      date_min: "",
      date_max: "",
      status_date_min: "",
      status_date_max: "",
    });
    filterApartments({ table: "apartment" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Фильтр недвижимости</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto scrollbar-hide px-4">
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
          
          {/* current status */}
          <div>
            <Label>Текущий статус</Label>
            <Select
              onValueChange={(value) => handleChange("current_status", value)}
              value={filters.current_status}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_OPTIONS).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* house_condtion */}
          <div>
            <Label>Состояние дома</Label>
            <Select
              onValueChange={(value) => handleChange("house_condition", value)}
              value={filters.house_condition}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите состояние дома" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="euro">Евро</SelectItem>
                <SelectItem value="normal">Обычный</SelectItem>
                <SelectItem value="repair">Требует ремонта</SelectItem>
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
                {Object.entries(BATHROOM_OPTIONS).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Responsible */}
          <div>
            <Label>Ответственный</Label>
            <Select
              onValueChange={(value) => handleChange("responsible", value)}
              value={filters.responsible}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите ответственного" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.full_name}>
                    {user.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Дата от</Label>
              <Input
                type="date"
                value={filters.date_min}
                onChange={(e) => handleChange("date_min", e.target.value)}
              />
            </div>
            <div>
              <Label>Дата до</Label>
              <Input
                type="date"
                value={filters.date_max}
                onChange={(e) => handleChange("date_max", e.target.value)}
              />
            </div>
          </div>

          {/* Status Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Дата статуса от</Label>
              <Input
                type="date"
                value={filters.status_date_min}
                onChange={(e) =>
                  handleChange("status_date_min", e.target.value)
                }
              />
            </div>
            <div>
              <Label>Дата статуса до</Label>
              <Input
                type="date"
                value={filters.status_date_max}
                onChange={(e) =>
                  handleChange("status_date_max", e.target.value)
                }
              />
            </div>
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
