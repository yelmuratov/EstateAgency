"use client";

import { useState, useEffect } from "react";
import usePropertyStore from "@/store/MetroDistrict/propertyStore";
import { useCommercialStore } from "@/store/commercial/commercialStore";
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

interface CommercialFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommercialFilter({
  open,
  onOpenChange,
}: CommercialFilterProps) {
  const {districts, fetchDistricts } = usePropertyStore();
  const { filterCommercials } = useCommercialStore();

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  useEffect(() => {
    const savedFilters = localStorage.getItem("commercialFilters");
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      setFilters(parsedFilters);
    }
  }, []);

  const [filters, setFilters] = useState<Record<string, string>>({
    table: "commercial",
    district: "",
    action_type: "",
    price_min: "",
    price_max: "",
    area_min: "",
    area_max: "",
    location_commercial: "",
    current_status: "",
    parking_place: "",
    date_min: "",
    date_max: "",
    status_date_min: "",
    status_date_max: "",
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

    localStorage.setItem("commercialFilters", JSON.stringify(filters));
    filterCommercials(changedFilters, "commercial");
    onOpenChange(false); // Close modal
  };

  const clearFilters = () => {
    const emptyFilters = {
      table: "commercial",
      district: "",
      action_type: "",
      price_min: "",
      price_max: "",
      area_min: "",
      area_max: "",
      location_commercial: "",
      current_status: "",
      parking_place: "",
      date_min: "",
      date_max: "",
      status_date_min: "",
      status_date_max: "",
      responsible: "",
    };
    setFilters(emptyFilters);
    localStorage.removeItem("commercialFilters");
    filterCommercials({ table: "commercial" }, "commercial");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Фильтр недвижимости</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[800px] overflow-y-scroll px-4">
          {/* District */}
          <div className="grid gap-4">
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
            {/* action type */}
            <div>
              <Label>Тип действия</Label>
              <Select
                onValueChange={(value) => handleChange("action_type", value)}
                value={filters.action_type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип действия" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Продажа</SelectItem>
                  <SelectItem value="rent">Аренда</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* house condition */}
          <div>
              <Label>Тип действия</Label>
              <Select
                onValueChange={(value) => handleChange("house_condition", value)}
                value={filters.action_type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Вверите состояние дома" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="euro">Евро</SelectItem>
                  <SelectItem value="normal">Обычный</SelectItem>
                  <SelectItem value="repair">Требует Требует ремонтаа</SelectItem>
                </SelectContent>
              </Select>
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
            <Input
              placeholder="Тип санузла (раздельный, совмещенный)"
              value={filters.bathroom}
              onChange={(e) => handleChange("bathroom", e.target.value)}
            />
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
          {/* Commercial Location */}
          <div>
            <Label>Расположение коммерческой недвижимости</Label>
            <Select
              onValueChange={(value) =>
                handleChange("location_commercial", value)
              }
              value={filters.location_commercial}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите расположение" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business_center">Бизнес-центр</SelectItem>
                <SelectItem value="administrative_building">
                  Административное здание
                </SelectItem>
                <SelectItem value="residential_building">
                  Жилое здание
                </SelectItem>
                <SelectItem value="shopping_mall">Торговый центр</SelectItem>
                <SelectItem value="industrial_zone">
                  Промышленная зона
                </SelectItem>
                <SelectItem value="market">Рынок</SelectItem>
                <SelectItem value="detached_building">
                  Отдельно стоящее здание
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Parking Place */}
          <div>
            <Label>Парковка</Label>
            <Select
              onValueChange={(value) => handleChange("parking_place", value)}
              value={filters.parking_place}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите наличие парковки" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Да</SelectItem>
                <SelectItem value="false">Нет</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Commercial Status */}
          <div>
            <Label>Статус коммерческой недвижимости</Label>
            <Select
              onValueChange={(value) => handleChange("current_status", value)}
              value={filters.current_status}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Свободно</SelectItem>
                <SelectItem value="rented">Сдано</SelectItem>
                <SelectItem value="sold">Продано</SelectItem>
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
