"use client";

import { useState, useRef, useEffect } from "react";
import { AxiosError } from "axios";
import { useForm, Controller } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from 'lucide-react';
import Image from "next/image";
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
import { Loader2, Upload} from 'lucide-react';
import usePropertyStore from "@/store/MetroDistrict/propertyStore";
import { useCommercialStore } from "@/store/commercial/commercialStore";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Toaster } from "@/components/ui/toaster";
import Spinner from "@/components/local-components/spinner";
import { UserStore } from "@/store/userStore";
import useAuth from "@/hooks/useAuth";

interface CommercialFormData {
  district: string;
  title: string;
  category: "commercial";
  action_type: "rent" | "sale";
  description?: string;
  comment?: string;
  price: number;
  rooms: number;
  square_area: number;
  floor_number: number;
  location:
    | "business_center"
    | "administrative_building"
    | "residential_building"
    | "cottage"
    | "shopping_mall"
    | "industrial_zone"
    | "market"
    | "detached_building";
  furnished: boolean;
  house_condition: "euro" | "normal" | "repair";
  current_status?: "free" | "soon" | "busy";
  parking_place: boolean;
  agent_percent: number;
  agent_commission?: number;
  crm_id?: string;
  responsible?: string;
  id?: number;
  media?: { id: number; url: string }[];
}

export default function EditCommercialPropertyForm() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<{ id: number; url: string }[]>([]);
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  useAuth();
  const { districts, fetchDistricts } = usePropertyStore();
  const { fetchCommercialById } = useCommercialStore();
  const { user } = UserStore();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CommercialFormData>();

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  const errorTranslations: { [key: string]: string } = {
    "401: This object created by another agent": "401: Этот объект создан другим агентом",
    "Network Error: Unable to reach the server.": "Ошибка сети: Не удалось подключиться к серверу.",
    "Server Error: 500": "Ошибка сервера: 500",
    // Add more translations as needed
  };

  const translateError = (message: string): string => {
    return errorTranslations[message] || message; // Fallback to the original message
  };


  useEffect(() => {
    const loadCommercial = async () => {
      if (id) {
        try {
          const commercialData = await fetchCommercialById(Number(id));
          if (commercialData !== null) {
            reset({
              ...commercialData,
              category: "commercial",
              action_type: commercialData.action_type as "rent" | "sale",
              location: commercialData.location as CommercialFormData["location"],
              house_condition: commercialData.house_condition as "euro" | "normal" | "repair",
              current_status: commercialData.current_status as "free" | "soon" | "busy",
            });
            if (commercialData.media) {
              setPreviewImages(
                commercialData.media.map((m: { id: number; url: string }) => ({
                  id: m.id,
                  url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/${m.url}`,
                }))
              );
            }
          }
        } catch (error) {
          toast({
            title: "Error",
            description: `Failed to load commercial property data: ${error}`,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadCommercial();
  }, [id, fetchCommercialById, reset, toast]);

  const [initialData, setInitialData] = useState<CommercialFormData | null>(null);

  useEffect(() => {
    const loadCommercial = async () => {
      if (id) {
        try {
          const commercialData = await fetchCommercialById(Number(id));
          if (commercialData) {
            const mappedData: CommercialFormData = {
              district: commercialData.district || "",
              title: commercialData.title || "",
              category: "commercial",
              action_type: commercialData.action_type as "rent" | "sale",
              description: commercialData.description || "",
              comment: commercialData.comment || "",
              price: commercialData.price || 0,
              rooms: commercialData.rooms || 0,
              square_area: commercialData.square_area || 0,
              floor_number: commercialData.floor_number || 0,
              location: commercialData.location as CommercialFormData["location"],
              furnished: commercialData.furnished || false,
              house_condition: commercialData.house_condition as "euro" | "normal" | "repair",
              current_status: commercialData.current_status as "free" | "soon" | "busy",
              parking_place: commercialData.parking_place || false,
              agent_percent: commercialData.agent_percent || 0,
              agent_commission: commercialData.agent_commission || 0,
              crm_id: commercialData.crm_id || "",
              responsible: commercialData.responsible || "",
              id: commercialData.id || 0,
            };

            setInitialData(mappedData);
            reset(mappedData);
          }
        } catch (error) {
          toast({
            title: "Error",
            description: `Failed to load commercial property data: ${error}`,
            variant: "destructive",
          });
        }
      }
    };

    loadCommercial();
  }, [id, fetchCommercialById, reset, toast]);

  if (loading) {
    return <Spinner theme="dark" />;
  }

  const onSubmit = async (data: CommercialFormData) => {
    try {
      if (!initialData) {
        throw new Error("Initial data not loaded.");
      }

      const queryParams: Record<string, string> = {};
      let hasTextChanges = false;
      let hasFileChanges = false;

      (Object.keys(data) as (keyof CommercialFormData)[]).forEach((key) => {
        const currentValue = data[key];
        const initialValue = initialData[key];

        if (key !== "media" as keyof CommercialFormData && currentValue !== initialValue) {
          queryParams[key] = currentValue?.toString() || "";
          hasTextChanges = true;
        }
      });

      if (mediaFiles && mediaFiles.length > 0) {
        hasFileChanges = true;
      }

      if (deletedImageIds.length > 0) {
        hasFileChanges = true;
      }

      if (!hasTextChanges && !hasFileChanges) {
        toast({
          title: "No changes detected",
          description: "No changes were made to the commercial property data.",
          variant: "default",
        });
        return;
      }

      setIsSubmitting(true);

      if (deletedImageIds.length > 0) {
        try {
          const uniqueDeletedIds = [...new Set(deletedImageIds)];
          const deleteParams = new URLSearchParams();
          deleteParams.append("table", "commercial");
          uniqueDeletedIds.forEach((id) => deleteParams.append("media", id.toString()));

          await api.delete(`/additional/delete_media/?${deleteParams.toString()}`);
          toast({
            title: "Success",
            description: "Deleted images successfully.",
            variant: "default",
          });
        } catch (deleteError) {
          toast({
            title: "Error",
            description: `Failed to delete images: ${deleteError}`,
            variant: "destructive",
          });
          return;
        }
      }

      if (hasFileChanges || hasTextChanges) {
        const queryString = new URLSearchParams(queryParams).toString();
        const url = `/commercial/${id}${queryString ? `?${queryString}` : ""}`;

        if (hasFileChanges) {
          const formData = new FormData();

          if (mediaFiles && mediaFiles?.length > 0) {
            for (const file of mediaFiles) {
              formData.append("media", file);
            }

            await api.put(url, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
          }
        }

        if (hasTextChanges && !hasFileChanges) {
          await api.put(url, queryParams);
        }

        toast({
          title: "Success",
          description: "Commercial property updated successfully.",
          variant: "default",
        });
        router.push("/");
      }
    } catch (error: unknown) {
      let errorMessage = "Произошла непредвиденная ошибка.";
    
      // Check if the error is an AxiosError
      if (error && typeof error === "object" && "isAxiosError" in error) {
        const axiosError = error as AxiosError<{ detail?: string | Record<string, string> }>;
    
        if (axiosError.response) {
          const details = axiosError.response.data?.detail;
    
          if (details && typeof details === "object" && !Array.isArray(details)) {
            // Handle validation error object (e.g., 422)
            errorMessage = Object.values(details)
              .map((msg) => `${msg}`)
              .join(", ");
          } else if (typeof details === "string") {
            // Handle single string error message
            errorMessage = translateError(details);
          } else {
            // Default fallback for server errors
            errorMessage = translateError(`Server Error: ${axiosError.response.status}`);
          }
        } else {
          // Network error fallback
          errorMessage = translateError("Network Error: Unable to reach the server.");
        }
      } else if (error instanceof Error) {
        // Handle generic JavaScript errors
        errorMessage = translateError(error.message);
      }
    
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setMediaFiles(files);

    if (files) {
      const newPreviewImages: { id: number; url: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviewImages.push({
              id: Date.now() + i,
              url: e.target.result as string,
            });
            if (newPreviewImages.length === files.length) {
              setPreviewImages((prev) => [...prev, ...newPreviewImages]);
            }
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const removeImage = (imageId: number) => {
    setDeletedImageIds((prev) => [...prev, imageId]);
    setPreviewImages((prev) => prev.filter((image) => image.id !== imageId));

    toast({
      title: "Image removed",
      description: "Image marked for deletion.",
      variant: "default",
    });
  };

  return (
    <DashboardLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl mx-auto"
      >
        <Toaster />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="district">Район</Label>
            <Controller
              name="district"
              control={control}
              rules={{ required: "Это поле обязательно" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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
              <p className="text-red-500 text-sm mt-1">
                {errors.district.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
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
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="action_type">Тип действия</Label>
            <Controller
              name="action_type"
              control={control}
              rules={{ required: "Это поле обязательно" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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

          <div className="space-y-2">
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
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
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
              <p className="text-red-500 text-sm mt-1">
                {errors.rooms.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
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

          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="location">Расположение</Label>
            <Controller
              name="location"
              control={control}
              rules={{ required: "Это поле обязательно" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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
                    <SelectItem value="cottage">Коттедж</SelectItem>
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
              )}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="house_condition">Состояние</Label>
            <Controller
              name="house_condition"
              control={control}
              rules={{ required: "Это поле обязательно" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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

          <div className="space-y-2">
            <Label htmlFor="current_status">Текущий статус</Label>
            <Controller
              name="current_status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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

          <div className="space-y-2">
            <Label htmlFor="parking_place">Парковка</Label>
            <Controller
              name="parking_place"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value ? "true" : "false"}
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

          <div className="space-y-2">
            <Label htmlFor="agent_percent">Процент агента</Label>
            <Input
              id="agent_percent"
              type="number"
              step="0.01"
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

          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="crm_id">CRM ID</Label>
            <Input
              id="crm_id"
              {...register("crm_id", {
                maxLength: { value: 255, message: "Максимум 255 символов" },
              })}
              placeholder="Введите CRM ID (необязательно)"
            />
            {errors.crm_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.crm_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
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
        </div>

        <div className="space-y-2">
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

        <div className="space-y-2">
          <Label htmlFor="comment">Комментарий</Label>
          <Textarea
            id="comment"
            {...register("comment", {
              maxLength: { value: 6000, message: "Максимум 6000 символов" },
            })}
            placeholder="Введите комментарий (необязательно)"
          />
          {errors.comment && (
            <p className="text-red-500 text-sm mt-1">
              {errors.comment.message}
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
              {previewImages.map((image) => (
                <div key={image.id} className="relative">
                  <Image
                    src={image.url}
                    alt={`Preview ${image.id}`}
                    width={150}
                    height={150}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    onClick={() => removeImage(image.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Обновление...
            </>
          ) : (
            "Обновить коммерческую недвижимость"
          )}
        </Button>
        <Button
          type="button"
          onClick={() => router.push("/")}
          className="w-full"
        >
          <ArrowLeft className="mr-2" />
          Назад
        </Button>
      </form>
    </DashboardLayout>
  );
}
