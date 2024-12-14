"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X } from 'lucide-react';
import usePropertyStore from "@/store/MetroDistrict/propertyStore";

interface LandFormData {
  district: string;
  title: string;
  category: "land";
  action_type: "rent" | "sale";
  description?: string;
  comment?: string;
  price: number;
  rooms: number;
  square_area: number;
  live_square_area: number;
  floor_number: number;
  location: "city" | "suburb" | "countryside" | "along_road" | "near_pond" | "foothills" | "cottage_area" | "closed_area";
  furnished: boolean;
  house_condition: "euro" | "normal" | "repair";
  current_status?: "free" | "soon" | "busy";
  parking_place: boolean;
  agent_percent: number;
  agent_commission?: number;
  crm_id?: string;
  responsible?: string;
  media?: FileList;
}

export default function LandPropertyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LandFormData>({
    defaultValues: {
      category: "land",
      furnished: true,
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { districts, fetchDistricts } = usePropertyStore();

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  const onSubmit = async (data: LandFormData) => {
    try {
      const formData = new FormData();

      if (mediaFiles && mediaFiles.length > 0) {
        for (let i = 0; i < mediaFiles.length; i++) {
          formData.append("media", mediaFiles[i]);
        }
      }

      const params = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      setIsSubmitting(true);
      await api.post(`/land/?${params.toString()}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Успех",
        description: "Земельный участок успешно добавлен",
        variant: "default",
      });

      reset();
      setPreviewImages([]);
      setMediaFiles(null);
      setIsSubmitting(false);
    } catch (error) {
      const apiError = error as {
        code?: string;
        response?: {
          status?: number;
          data?: {
            detail?: string | { loc: string[]; msg: string }[];
            msg?: string;
          };
        };
        message?: string;
      };
    
      const statusCode = apiError.response?.status;
      const errorDetail = apiError.response?.data?.detail;
      const isTimeout = apiError.code === "ECONNABORTED";
    
      if (isTimeout) {
        toast({
          title: "Timeout Error",
          description: "The request took too long to complete. Please try again.",
          variant: "destructive",
          action: (
            <button
              onClick={() => handleSubmit(onSubmit)()} // Retry submission
              className="text-sm font-medium text-blue-500 hover:underline"
            >
              Retry
            </button>
          ),
        });
      } else if (!apiError.response) {
        toast({
          title: "Network Error",
          description: "Unable to reach the server. Check your connection and try again.",
          variant: "destructive",
        });
      } else if (statusCode === 400 || statusCode === 422) {
        if (typeof errorDetail === "string") {
          toast({
            title: "Validation Error",
            description: errorDetail,
            variant: "destructive",
          });
        } else if (Array.isArray(errorDetail)) {
          const formattedErrors = errorDetail
            .map((err) => `- ${err.loc.join(" -> ")}: ${err.msg}`)
            .join("\n");
    
          toast({
            title: "Validation Error",
            description: `The following issues were found:\n${formattedErrors}`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Validation Error",
            description: "Invalid data submitted.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: apiError.response?.data?.msg || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setMediaFiles(files);
    if (files) {
      const newPreviewImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviewImages.push(e.target.result as string);
            if (newPreviewImages.length === files.length) {
              setPreviewImages(newPreviewImages);
            }
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const removeImage = (index: number) => {
    const newPreviewImages = [...previewImages];
    newPreviewImages.splice(index, 1);
    setPreviewImages(newPreviewImages);

    if (fileInputRef.current && fileInputRef.current.files) {
      const dt = new DataTransfer();
      const { files } = fileInputRef.current;
      for (let i = 0; i < files.length; i++) {
        if (i !== index) {
          dt.items.add(files[i]);
        }
      }
      fileInputRef.current.files = dt.files;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div>
        <Label htmlFor="district">Район</Label>
        <Controller
          name="district"
          control={control}
          rules={{ required: "Это поле обязательно" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="title">Название</Label>
        <Input
          id="title"
          {...register("title", {
            required: "Это поле обязательно",
            minLength: { value: 3, message: "Минимум 3 символа" },
            maxLength: { value: 50, message: "Максимум 50 символов" },
          })}
          placeholder="Введите название"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="category">Категория</Label>
        <Controller
          name="category"
          control={control}
          defaultValue="land"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="land">Земельный участок</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Label htmlFor="action_type">Тип действия</Label>
        <Controller
          name="action_type"
          control={control}
          rules={{ required: "Это поле обязательно" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип действия" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rent">Аренда</SelectItem>
                <SelectItem value="sale">Продажа</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.action_type && (
          <p className="text-red-500 text-sm mt-1">
            {errors.action_type.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          {...register("description", {
            maxLength: { value: 6000, message: "Максимум 6000 символов" },
          })}
          placeholder="Введите описание (необязательно)"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="comment">Комментарий</Label>
        <Textarea
          id="comment"
          {...register("comment", {
            maxLength: { value: 6000, message: "Максимум 6000 символов" },
          })}
          placeholder="Введите комментарий (необязательно)"
        />
        {errors.comment && (
          <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="price">Цена</Label>
        <Input
          id="price"
          type="number"
          {...register("price", {
            required: "Это поле обязательно",
            valueAsNumber: true,
          })}
          placeholder="Введите цену"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="rooms">Количество комнат</Label>
        <Input
          id="rooms"
          type="number"
          {...register("rooms", {
            required: "Это поле обязательно",
            valueAsNumber: true,
          })}
          placeholder="Введите количество комнат"
        />
        {errors.rooms && (
          <p className="text-red-500 text-sm mt-1">{errors.rooms.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="square_area">Общая площадь</Label>
        <Input
          id="square_area"
          type="number"
          {...register("square_area", {
            required: "Это поле обязательно",
            valueAsNumber: true,
          })}
          placeholder="Введите общую площадь"
        />
        {errors.square_area && (
          <p className="text-red-500 text-sm mt-1">
            {errors.square_area.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="live_square_area">Жилая площадь</Label>
        <Input
          id="live_square_area"
          type="number"
          {...register("live_square_area", {
            required: "Это поле обязательно",
            valueAsNumber: true,
          })}
          placeholder="Введите жилую площадь"
        />
        {errors.live_square_area && (
          <p className="text-red-500 text-sm mt-1">
            {errors.live_square_area.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="floor_number">Этажность</Label>
        <Input
          id="floor_number"
          type="number"
          {...register("floor_number", {
            required: "Это поле обязательно",
            valueAsNumber: true,
          })}
          placeholder="Введите этажность"
        />
        {errors.floor_number && (
          <p className="text-red-500 text-sm mt-1">
            {errors.floor_number.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="location">Расположение</Label>
        <Controller
          name="location"
          control={control}
          rules={{ required: "Это поле обязательно" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите расположение" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="city">Город</SelectItem>
                <SelectItem value="suburb">Пригород</SelectItem>
                <SelectItem value="countryside">Сельская местность</SelectItem>
                <SelectItem value="along_road">Вдоль дороги</SelectItem>
                <SelectItem value="near_pond">У водоема</SelectItem>
                <SelectItem value="foothills">Предгорье</SelectItem>
                <SelectItem value="cottage_area">Дачный массив</SelectItem>
                <SelectItem value="closed_area">Закрытая территория</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.location && (
          <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="furnished">Меблированная</Label>
        <Controller
          name="furnished"
          control={control}
          defaultValue={true}
          render={({ field }) => (
            <Select
              onValueChange={(value) => field.onChange(value === "true")}
              defaultValue={field.value ? "true" : "false"}
            >
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
          rules={{ required: "Это поле обязательно" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите состояние" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="euro">Евроремонт</SelectItem>
                <SelectItem value="normal">Обычное</SelectItem>
                <SelectItem value="repair">Требует ремонта</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.house_condition && (
          <p className="text-red-500 text-sm mt-1">
            {errors.house_condition.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="current_status">Текущий статус</Label>
        <Controller
          name="current_status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите текущий статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Свободно</SelectItem>
                <SelectItem value="soon">Скоро освободится</SelectItem>
                <SelectItem value="busy">Занято</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.current_status && (
          <p className="text-red-500 text-sm mt-1">
            {errors.current_status.message}
          </p>
        )}
      </div>

    <div>
      <Label htmlFor="parking_place">Парковка</Label>
      <Controller
        name="parking_place"
        control={control}
        rules={{ required: "Это поле обязательно" }}
        render={({ field }) => (
        <Select onValueChange={(value) => field.onChange(value === "true")}>
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
      {errors.parking_place && (
        <p className="text-red-500 text-sm mt-1">
        {errors.parking_place.message}
        </p>
      )}
    </div>

      <div>
        <Label htmlFor="agent_percent">Процент агента</Label>
        <Input
          id="agent_percent"
          type="number"
          {...register("agent_percent", {
            required: "Это поле обязательно",
            valueAsNumber: true,
          })}
          placeholder="Введите процент агента"
        />
        {errors.agent_percent && (
          <p className="text-red-500 text-sm mt-1">
            {errors.agent_percent.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="agent_commission">Комиссия агента</Label>
        <Input
          id="agent_commission"
          type="number"
          {...register("agent_commission", { valueAsNumber: true })}
          placeholder="Введите комиссию агента (необязательно)"
        />
        {errors.agent_commission && (
          <p className="text-red-500 text-sm mt-1">
            {errors.agent_commission.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="crm_id">CRM ID</Label>
        <Input
          id="crm_id"
          {...register("crm_id", {
            maxLength: { value: 255, message: "Максимум 255 символов" },
          })}
          placeholder="Введите CRM ID (необязательно)"
        />
        {errors.crm_id && (
          <p className="text-red-500 text-sm mt-1">{errors.crm_id.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="responsible">Ответственный</Label>
        <Input
          id="responsible"
          {...register("responsible")}
          placeholder="Введите ответственного (необязательно)"
        />
        {errors.responsible && (
          <p className="text-red-500 text-sm mt-1">
            {errors.responsible.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="images">Фотографии</Label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="images"
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Загрузить файлы</span>
                <input
                  id="images"
                  type="file"
                  className="sr-only"
                  multiple
                  {...register("media")}
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </label>
              <p className="pl-1">или перетащите сюда</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF до 10MB</p>
          </div>
        </div>
        {previewImages.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {previewImages.map((image, index) => (
  <div key={index} className="relative">
    <Image
      src={image}
      alt={`Preview ${index + 1}`}
      width={128} // Replace with actual width
      height={128} // Replace with actual height
      className="w-full h-32 object-cover rounded-md"
    />
    <button
      type="button"
      onClick={() => removeImage(index)}
      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
    >
      <X size={16} />
    </button>
    {index < previewImages.length - 1 && (
      <button
        type="button"
        onClick={() => removeImage(index + 1)}
        className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1"
      >
        Next
      </button>
    )}
  </div>
))}
          </div>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Сохранение...
          </>
        ) : (
          "Добавить земельный участок"
        )}
      </Button>
    </form>
  );
}

