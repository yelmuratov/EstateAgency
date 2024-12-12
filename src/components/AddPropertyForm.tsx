"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import usePropertyStore from "@/store/MetroDistrict/propertyStore";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FormData {
  district: string;
  metro_st: string;
  title: string;
  category: "Квартиры" | "Коммерция" | "Участки";
  description?: string;
  comment?: string;
  price: string;
  house_type: "Новостройка" | "Вторичка";   
  action_type: "rent" | "sale";
  rooms: string;
  square_area: string;
  floor_number: string;
  floor: string;
  bathroom: string;
  furnished?: "Да" | "Нет" | "";
  house_condition: string;
  current_status: string;
  name: string;
  phone_number: string;
  agent_percent: string;
  landArea?: string;
  purpose?: string;
  parking?: "Да" | "Нет";
  live_square_area: string;
  location: string;
}

const AddPropertyForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const { metros, districts, fetchMetros, fetchDistricts, loading, error } =
    usePropertyStore();

  useEffect(() => {
    fetchMetros();
    fetchDistricts();
  }, [fetchMetros, fetchDistricts]);

  const [photos, setPhotos] = useState<string[]>([]);
  const selectedCategory = watch("category");

  const onSubmit = async (data: FormData) => {
    console.log(data);
  };

  const addPhoto = () => {
    setPhotos([...photos, "https://via.placeholder.com/150"]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Детали Объекта</h2>

          {/* Common Fields */}
          <div className="space-y-4">
            <Label htmlFor="district">Район</Label>
            <Controller
              name="district"
              control={control}
              rules={{ required: "Район обязателен" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange}>
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
              )}
            />
            {errors.district && (
              <p className="text-red-500">{errors.district.message}</p>
            )}
          </div>

          {selectedCategory === "Квартиры" && (
            <div className="space-y-4">
              <Label htmlFor="metro">Метро</Label>
              <Controller
                name="metro_st"
                control={control}
                rules={{ required: "Метро обязательно" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
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
                )}
              />
              {errors.metro_st && (
                <p className="text-red-500">{errors.metro_st.message}</p>
              )}
            </div>
          )}

          <div className="space-y-4">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              {...register("title", { required: "Название обязательно" })}
              maxLength={50}
            />
            <p className="text-sm text-muted-foreground mt-1">
              {watch("title")?.length || 0}/50
            </p>
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label>Категории</Label>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Категория обязательна" }}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="apartment" id="r1" />
                    <Label htmlFor="r1">Квартиры</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="commercial" id="r2" />
                    <Label htmlFor="r2">Коммерция</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="land" id="r3" />
                    <Label htmlFor="r3">Участки</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.category && (
              <p className="text-red-500">{errors.category.message}</p>
            )}
          </div>
          {/* Action Type */}
          <div className="space-y-4">
            <Label>Тип действия</Label>
            <Controller
              name="action_type"
              control={control}
              rules={{ required: "Тип действия обязателен" }}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rent" id="action_rent" />
                    <Label htmlFor="action_rent">Аренда</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sale" id="action_sale" />
                    <Label htmlFor="action_sale">Продажа</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.action_type && (
              <p className="text-red-500">{errors.action_type.message}</p>
            )}
          </div>

          {/* Photos */}
          <div className="space-y-4">
            <Label>Фото</Label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Property ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
              ))}
              <Button type="button" onClick={addPhoto} className="h-24">
                Добавить фото
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="description">Описание для клиента</Label>
            <Textarea
              id="description"
              {...register("description", { required: "Описание обязательно" })}
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label htmlFor="comment">Комментарий для агента</Label>
            <Textarea id="comment" {...register("comment")} />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Дополнительная Информация</h2>

          <div className="space-y-4">
            <Label htmlFor="price">Цена</Label>
            <Input
              id="price"
              {...register("price", { required: "Цена обязательна" })}
              placeholder="300000$"
            />
            {errors.price && (
              <p className="text-red-500">{errors.price.message}</p>
            )}
          </div>

          {selectedCategory === "Квартиры" && (
            <div className="space-y-4">
              <Label>Тип жилья</Label>
              <Controller
                name="house_type"
                control={control}
                rules={{ required: "Тип жилья обязателен" }}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new_building" id="r4" />
                      <Label htmlFor="r4">Новостройка</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="seconday" id="r5" />
                      <Label htmlFor="r5">Вторичка</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
          )}

          {/* Dynamic Fields */}

          <div className="space-y-4">
            <div>
              <Label htmlFor="rooms">Количество комнат</Label>
              <Input id="rooms" {...register("rooms")} />
            </div>

            {(selectedCategory === "Квартиры" ||
              selectedCategory === "Коммерция") && (
              <div>
                <Label htmlFor="area">Общая площадь (м²)</Label>
                <Input id="area" {...register("square_area")} />
              </div>
            )}

            {selectedCategory === "Участки" && (
              <div>
                <Label htmlFor="landArea">Площадь участка м2*</Label>
                <Input id="landArea" {...register("landArea")} />
              </div>
            )}

            {selectedCategory === "Участки" && (
              <div>
                <Label htmlFor="livingArea">Жилая площадь (м²)</Label>
                <Input id="livingArea" {...register("house_type")} />
              </div>
            )}

            <div>
              <Label htmlFor="totalFloors">Этажность</Label>
              <Input id="totalFloors" {...register("floor_number")} />
            </div>

            {/* Location */}
            <div className="space-y-4">
              <Label htmlFor="location">Расположение</Label>
              <Controller
                name="location"
                control={control}
                rules={{ required: "Расположение обязательно" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите расположение" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="city">Город</SelectItem>
                      <SelectItem value="suburb">Пригород</SelectItem>
                      <SelectItem value="countryside">
                        Сельская местность
                      </SelectItem>
                      <SelectItem value="along_road">Вдоль дороги</SelectItem>
                      <SelectItem value="near_pond">Возле пруда</SelectItem>
                      <SelectItem value="foothills">Предгорья</SelectItem>
                      <SelectItem value="cottage_area">
                        Коттеджный район
                      </SelectItem>
                      <SelectItem value="closed_area">
                        Закрытая территория
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.location && (
                <p className="text-red-500">{errors.location.message}</p>
              )}
            </div>

            {(selectedCategory === "Квартиры" ||
              selectedCategory === "Коммерция") && (
              <div>
                <Label htmlFor="floor">Этаж</Label>
                <Input id="floor" {...register("floor")} />
              </div>
            )}

            {(selectedCategory === "Коммерция" ||
              selectedCategory === "Участки") && (
              <div>
                <Label htmlFor="purpose">Расположение</Label>
                <Input id="purpose" {...register("purpose")} />
              </div>
            )}

            {selectedCategory === "Квартиры" && (
              <div>
                <Label htmlFor="bathroom">Санузел</Label>
                <Controller
                  name="bathroom"
                  control={control}
                  rules={{ required: "Тип санузла обязателен" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип санузла" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Раздельный">Раздельный</SelectItem>
                        <SelectItem value="Совмещенный">Совмещенный</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}

            <div>
              <Label htmlFor="furnished">Мебелированна</Label>
              <Controller
                name="furnished"
                control={control}
                rules={{ required: "Мебелировка обязательна" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Да</SelectItem>
                      <SelectItem value="false">Нет</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="house_condition">Состояние</Label>
              <Controller
                name="house_condition"
                control={control}
                rules={{ required: "Состояние обязательно" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите состояние" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="euro">Евроремонт</SelectItem>
                      <SelectItem value="notmal">Среднее</SelectItem>
                      <SelectItem value="repair">Требует ремонта</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {selectedCategory != "Квартиры" && (
              <div>
                <Label htmlFor="parking">Парковочное место</Label>
                <Controller
                  name="parking"
                  control={control}
                  rules={{ required: "Выбор парковочного места обязателен" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Да/Нет" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Да">Да</SelectItem>
                        <SelectItem value="Нет">Нет</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.parking && (
                  <p className="text-red-500">{errors.parking.message}</p>
                )}
              </div>
            )}

            {/* Current Status */}
            <div className="space-y-4">
              <Label>Текущий статус</Label>
              <Controller
                name="current_status"
                control={control}
                rules={{ required: "Текущий статус обязателен" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Свободно</SelectItem>
                      <SelectItem value="soon">Скоро</SelectItem>
                      <SelectItem value="busy">Занято</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.current_status && (
                <p className="text-red-500">{errors.current_status.message}</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-4">
              <Label htmlFor="name">Имя контактного лица</Label>
              <Input
                id="name"
                {...register("name", {
                  required: "Имя обязательно",
                  minLength: {
                    value: 3,
                    message: "Имя должно содержать минимум 3 символа",
                  },
                  maxLength: {
                    value: 100,
                    message: "Имя должно содержать не более 100 символов",
                  },
                })}
                placeholder="Введите имя"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-4">
              <Label htmlFor="phone_number">Номер телефона</Label>
              <Input
                id="phone_number"
                {...register("phone_number", {
                  required: "Номер телефона обязателен",
                  minLength: {
                    value: 3,
                    message:
                      "Номер телефона должен содержать минимум 3 символа",
                  },
                  maxLength: {
                    value: 13,
                    message:
                      "Номер телефона должен содержать не более 13 символов",
                  },
                  pattern: {
                    value: /^[0-9+]+$/,
                    message:
                      "Номер телефона должен содержать только цифры и символ '+'",
                  },
                })}
                placeholder="+998901234567"
              />
              {errors.phone_number && (
                <p className="text-red-500">{errors.phone_number.message}</p>
              )}
            </div>

            {/* Agent Percent */}
            <div className="space-y-4">
              <Label htmlFor="agent_percent">Процент агента</Label>
              <Input
                id="agent_percent"
                type="number"
                {...register("agent_percent", {
                  required: "Процент агента обязателен",
                  min: {
                    value: 0,
                    message: "Процент агента не может быть меньше 0",
                  },
                  max: {
                    value: 100,
                    message: "Процент агента не может быть больше 100",
                  },
                })}
                placeholder="Введите процент агента"
              />
              {errors.agent_percent && (
                <p className="text-red-500">{errors.agent_percent.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Сохранить
      </Button>
    </form>
  );
};

export default AddPropertyForm;
