"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import usePropertyStore from "@/store/MetroDistrict/propertyStore";
import { useLandStore } from "@/store/land/landStore";
import { UserStore } from "@/store/users/userStore";

// UI Components
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
import { Form } from "@/components/ui/form";

const LOCATION_OPTIONS = {
  city: "Город",
  suburb: "Пригород",
  countryside: "Сельская местность",
  along_road: "Вдоль дороги",
  near_pond: "У водоема",
  foothills: "Предгорье",
  cottage_area: "Дачный массив",
  closed_area: "Закрытая территория",
};

const HOUSE_CONDITION_OPTIONS = {
  euro: "Евро",
  normal: "Обычное",
  repair: "Требует ремонта",
};

const STATUS_OPTIONS = {
  free: "Свободно",
  soon: "Скоро освободится",
  busy: "Занято",
};

interface LandFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FormSchema = z.object({
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  statusDateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
});

export function LandFilter({ open, onOpenChange }: LandFilterProps) {
  const { districts, fetchDistricts } = usePropertyStore();
  const { filterLands } = useLandStore();
  const { fetchUsers, users } = UserStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dateRange: { from: undefined, to: undefined },
      statusDateRange: { from: undefined, to: undefined },
    },
  });

  useEffect(() => {
    fetchDistricts();
    fetchUsers();
  }, [fetchDistricts, fetchUsers]);

  const [filters, setFilters] = useState<Record<string, string>>({
    table: "land",
    district: "",
    action_type: "",
    price_min: "",
    price_max: "",
    area_min: "",
    area_max: "",
    location_land: "",
    house_condition: "",
    current_status: "",
    parking_place: "",
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
    const updatedFilters = {
      ...filters,
      date_min: filters.date_min ? format(new Date(filters.date_min), "yyyy-MM-dd") : "",
      date_max: filters.date_max ? format(new Date(filters.date_max), "yyyy-MM-dd") : "",
      status_date_min: filters.status_date_min ? format(new Date(filters.status_date_min), "yyyy-MM-dd") : "",
      status_date_max: filters.status_date_max ? format(new Date(filters.status_date_max), "yyyy-MM-dd") : "",
    };

    // Filter out empty fields
    const changedFilters = Object.fromEntries(
      Object.entries(updatedFilters).filter(([, value]) => value !== "")
    );

    localStorage.setItem("landFilters", JSON.stringify(updatedFilters));
    filterLands({ table: "land", ...changedFilters });
    onOpenChange(false);
  };

  const clearFilters = () => {
    const emptyFilters = {
      table: "land",
      district: "",
      action_type: "",
      price_min: "",
      price_max: "",
      area_min: "",
      area_max: "",
      location_land: "",
      house_condition: "",
      current_status: "",
      parking_place: "",
      responsible: "",
      date_min: "",
      date_max: "",
      status_date_min: "",
      status_date_max: "",
    };
    setFilters(emptyFilters);
    form.reset();
    localStorage.removeItem("landFilters");
    filterLands({ table: "land" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Фильтр земельных участков</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <div className="grid gap-4 py-4">
            {/* District */}
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

            {/* Action Type */}
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

            {/* Location */}
            <div>
              <Label>Расположение</Label>
              <Select
                onValueChange={(value) => handleChange("location_land", value)}
                value={filters.location_land}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите расположение" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LOCATION_OPTIONS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* House Condition */}
            <div>
              <Label>Состояние</Label>
              <Select
                onValueChange={(value) =>
                  handleChange("house_condition", value)
                }
                value={filters.house_condition}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите состояние" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(HOUSE_CONDITION_OPTIONS).map(
                    ([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Current Status */}
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

            {/* Date Range */}
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
                  onChange={(e) => handleChange("status_date_min", e.target.value)}
                />
              </div>
              <div>
                <Label>Дата статуса до</Label>
                <Input
                  type="date"
                  value={filters.status_date_max}
                  onChange={(e) => handleChange("status_date_max", e.target.value)}
                />
              </div>
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
          </div>
        </Form>
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
