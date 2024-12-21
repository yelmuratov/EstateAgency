"use client";

import { useState, useRef, useEffect } from "react";
import { AxiosError } from "axios";
import { useForm, Controller } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from 'lucide-react';

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
import { Loader2, Upload } from 'lucide-react';
import usePropertyStore from "@/store/MetroDistrict/propertyStore";
import { useApartmentStore } from "@/store/apartment/aparmentStore";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import Spinner from "@/components/local-components/spinner";
import { UserStore } from "@/store/userStore";
import {UserStore as UsersStore} from "@/store/users/userStore"
import useAuth from "@/hooks/useAuth";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ApartmentFormData {
  district: string;
  metro_st: string;
  title: string;
  category: "apartment";
  action_type: "rent" | "sale";
  description?: string;
  comment?: string;
  price: number;
  house_type: "new_building" | "secondary";
  rooms: number;
  square_area: number;
  floor_number: number;
  floor: number;
  bathroom: "seperated" | "combined" | "many";
  furnished: boolean;
  house_condition: "euro" | "normal" | "repair";
  current_status: "free" | "soon" | "busy";
  name: string;
  phone_number: string;
  agent_percent: number;
  agent_commission?: number;
  crm_id?: string;
  responsible?: string;
  id?: number;
  status_date?: string;
  second_responsible: string;
  second_agent_percent?: number;
}

export default function EditApartmentForm() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<
    { id: number; url: string; media_type: string }[]
  >([]);
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  useAuth();

  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]); // Track deleted image IDs
  const { metros, districts, fetchMetros, fetchDistricts } = usePropertyStore();
  const { fetchApartmentById } = useApartmentStore();

  const { user } = UserStore();
  const {users, fetchUsers} = UsersStore();

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
  } = useForm<ApartmentFormData>();

  useEffect(() => {
    fetchMetros();
    fetchDistricts();
    fetchUsers();
  }, [fetchMetros, fetchDistricts, fetchUsers]);

  useEffect(() => {
    const loadApartment = async () => {
      if (id) {
        try {
          const apartmentData = await fetchApartmentById(Number(id));
          if (apartmentData) {
            reset({
              ...apartmentData,
              category: "apartment",
              action_type: apartmentData.action_type as "rent" | "sale",
              house_type: apartmentData.house_type as
                | "new_building"
                | "secondary",
              bathroom: apartmentData.bathroom as
                | "seperated"
                | "combined"
                | "many",
              house_condition: apartmentData.house_condition as
                | "euro"
                | "normal"
                | "repair",
              current_status: apartmentData.current_status as
                | "free"
                | "soon"
                | "busy",
            });
            if (apartmentData.media) {
              setPreviewImages(
                apartmentData.media.map((m: { id: number; url: string; media_type: string }) => ({
                  id: m.id,
                  url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/${m.url}`,
                  media_type: m.media_type
                }))
              );
            }
          }
        } catch (error) {
          toast({
            title: "Error",
            description: `Failed to load apartment data: ${
              (error as Error).message
            }`,
            variant: "destructive",
          });
        } finally {
          setLoading(false); // Stop loading when data fetching is complete
        }
      }
    };

    loadApartment();
  }, [id, fetchApartmentById, reset, toast]);

  const [initialData, setInitialData] = useState<ApartmentFormData | null>(
    null
  );

  useEffect(() => {
    const loadApartment = async () => {
      if (id) {
        try {
          const apartmentData = await fetchApartmentById(Number(id));
          if (apartmentData) {
            const mappedData: ApartmentFormData = {
              district: apartmentData.district || "",
              metro_st: apartmentData.metro_st || "",
              title: apartmentData.title || "",
              category: "apartment",
              action_type: apartmentData.action_type as "rent" | "sale",
              description: apartmentData.description || "",
              comment: apartmentData.comment || "",
              price: apartmentData.price || 0,
              house_type: apartmentData.house_type as
                | "new_building"
                | "secondary",
              rooms: apartmentData.rooms || 0,
              square_area: apartmentData.square_area || 0,
              floor_number: apartmentData.floor_number || 0,
              floor: apartmentData.floor || 0,
              bathroom: apartmentData.bathroom as
                | "seperated"
                | "combined"
                | "many",
              furnished: apartmentData.furnished || false,
              house_condition: apartmentData.house_condition as
                | "euro"
                | "normal"
                | "repair",
              current_status: apartmentData.current_status as
                | "free"
                | "soon"
                | "busy",
              name: apartmentData.name || "",
              phone_number: apartmentData.phone_number || "",
              agent_percent: apartmentData.agent_percent || 0,
              agent_commission: apartmentData.agent_commission || 0,
              crm_id: apartmentData.crm_id || "",
              responsible: apartmentData.responsible || "",
              id: apartmentData.id || 0,
              status_date: apartmentData.status_date || "",
              second_responsible: apartmentData.second_responsible || "",
              second_agent_percent: apartmentData.second_agent_percent || 0,
            };

            setInitialData(mappedData); // Set initial data for comparison
            reset(mappedData); // Populate the form with initial values
          }
        } catch (error) {
          toast({
            title: "Error",
            description: `Failed to load apartment data: ${
              (error as Error).message
            }`,
            variant: "destructive",
          });
        }
      }
    };

    loadApartment();
  }, [id, fetchApartmentById, reset, toast]);

  if (loading) {
    return <Spinner theme="dark" />;
  }

  const errorTranslations: { [key: string]: string } = {
    "401: This object created by another agent":
      "401: Этот объект создан другим агентом",
    "Network Error: Unable to reach the server.":
      "Ошибка сети: Не удалось подключиться к серверу.",
    "Server Error: 500": "Ошибка сервера: 500",
    // Add more translations as needed
  };

  const translateError = (message: string): string => {
    return errorTranslations[message] || message; // Fallback to the original message
  };

  const onSubmit = async (data: ApartmentFormData) => {
    try {
      if (!initialData) {
        throw new Error("Initial data not loaded.");
      }

      const queryParams: Record<string, string> = {};
      let hasTextChanges = false;
      let hasFileChanges = false;

      // Detect text changes (excluding media)
      (Object.keys(data) as (keyof ApartmentFormData)[]).forEach((key) => {
        const currentValue = data[key];
        const initialValue = initialData[key];

        if (
          key !== ("media" as keyof ApartmentFormData) &&
          currentValue?.toString() !== initialValue?.toString() // Convert to string for comparison
        ) {
          queryParams[key] = currentValue?.toString() || "";
          hasTextChanges = true;
        }
      });

      // Check for new media files
      if (mediaFiles && mediaFiles.length > 0) {
        hasFileChanges = true;
      }

      // Check for deleted images
      if (deletedImageIds.length > 0) {
        hasFileChanges = true;
      }

      // If no changes detected, exit early
      if (!hasTextChanges && !hasFileChanges) {
        toast({
          title: "Изменения не обнаружены",
          description: "Изменения не обнаружены",
          variant: "default",
        });
        return;
      }

      setIsSubmitting(true);

      // Step 1: Handle Deleted Images
      if (deletedImageIds.length > 0) {
        try {
          const uniqueDeletedIds = [...new Set(deletedImageIds)];
          const queryParams = new URLSearchParams();
          queryParams.append("table", "apartment");
          uniqueDeletedIds.forEach((id) =>
            queryParams.append("media", id.toString())
          );

          await api.delete(
            `/additional/delete_media/?${queryParams.toString()}`
          );
          toast({
            title: "Success",
            description: "Deleted images successfully.",
            variant: "default",
          });
        } catch (deleteError) {
          toast({
            title: "Error",
            description: `Failed to delete images: ${
              (deleteError as Error).message
            }`,
            variant: "destructive",
          });
          return;
        }
      }

      // Step 2: Handle PUT Request
      if (hasFileChanges || hasTextChanges) {
        const queryString = new URLSearchParams(queryParams).toString();
        const url = `/apartment/${id}${queryString ? `?${queryString}` : ""}`;

        if (hasFileChanges) {
          const formData = new FormData();

          // Add media files only if they exist
          if (mediaFiles && mediaFiles?.length > 0) {
            for (const file of mediaFiles) {
              formData.append("media", file);
            }

            // Send request with FormData
            await api.put(url, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
          } else {
            console.warn(
              "No media files to upload. Skipping FormData submission."
            );
          }
        }

        // Handle text changes separately
        if (hasTextChanges && !hasFileChanges) {
          await api.put(url, queryParams);
        }

        toast({
          title: "Success",
          description: "Apartment updated successfully.",
          variant: "default",
        });
        router.push("/");
      }
    } catch (error: unknown) {
      let errorMessage = "Произошла непредвиденная ошибка.";

      if (error && typeof error === "object" && "isAxiosError" in error) {
        const axiosError = error as AxiosError<{ detail?: string }>;

        if (axiosError.response) {
          const detail = axiosError.response.data?.detail;

          if (detail) {
            errorMessage = translateError(detail); // Translate the error message
          } else {
            errorMessage = translateError(
              `Server Error: ${axiosError.response.status}`
            );
          }
        } else {
          errorMessage = translateError(
            "Network Error: Unable to reach the server."
          );
        }
      } else if (error instanceof Error) {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { files: FileList } }) => {
    const files = e.target.files;
    setMediaFiles(files);

    if (files) {
      const newPreviewImages: { id: number; url: string; media_type: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviewImages.push({
              id: Date.now() + i,
              url: e.target.result as string,
              media_type: file.type.startsWith('video/') ? 'video' : 'image'
            });
            if (newPreviewImages.length === files.length) {
              setPreviewImages((prev) => [...prev, ...newPreviewImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (imageId: number) => {
    // Remove the image ID from the preview
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
            <Label htmlFor="metro_st">Метро</Label>
            <Controller
              name="metro_st"
              control={control}
              rules={{ required: "Это поле обязательно" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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
              <p className="text-red-500 text-sm mt-1">
                {errors.metro_st.message}
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
            <Label htmlFor="house_type">Тип жилья</Label>
            <Controller
              name="house_type"
              control={control}
              rules={{ required: "Это поле обязательно" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип жилья" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_building">Новостройка</SelectItem>
                    <SelectItem value="secondary">Вторичное жилье</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.house_type && (
              <p className="text-red-500 text-sm mt-1">
                {errors.house_type.message}
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
              placeholder="Введите этажность дома"
            />
            {errors.floor_number && (
              <p className="text-red-500 text-sm mt-1">
                {errors.floor_number.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="floor">Этаж</Label>
            <Input
              id="floor"
              type="number"
              {...register("floor", {
                required: "Это поле обязательно",
                valueAsNumber: true,
              })}
              placeholder="Введите этаж квартиры"
            />
            {errors.floor && (
              <p className="text-red-500 text-sm mt-1">
                {errors.floor.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bathroom">Санузел</Label>
            <Controller
              name="bathroom"
              control={control}
              rules={{ required: "Это поле обязательно" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип санузла" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seperated">Раздельный</SelectItem>
                    <SelectItem value="combined">Совмещенный</SelectItem>
                    <SelectItem value="many">Несколько</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.bathroom && (
              <p className="text-red-500 text-sm mt-1">
                {errors.bathroom.message}
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
                    <SelectItem value="euro">Евро ремонт</SelectItem>
                    <SelectItem value="normal">Обычное</SelectItem>
                    <SelectItem value="repair">Требует Требует ремонтаа</SelectItem>
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
              rules={{ required: "Это поле обязательно" }}
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
            <Label htmlFor="status_date">Дата статуса</Label>
            <Controller
              name="status_date"
              control={control}
              rules={{
                validate: (value) => {
                  const currentStatus = control._formValues.current_status;
                  if (currentStatus !== "free" && !value) {
                    return "Это поле обязательно";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "yyyy-MM-dd")
                      ) : (
                        <span>Выберите дату</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.status_date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status_date.message}
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
            <Label>Второй ответственный</Label>
            <Controller
              name="second_responsible"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите Второй ответственный" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.full_name}>
                        {user.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="second_agent_percent">Процент второго агента</Label>
            <Input
              id="second_agent_percent"
              type="number"
              {...register("second_agent_percent", {
                valueAsNumber: true,
                min: { value: 0, message: "Процент не может быть меньше 0" },
                max: { value: 100, message: "Процент не может быть больше 100" },
              })}
              placeholder="Введите процент второго агента"
            />
            {errors.second_agent_percent && (
              <p className="text-red-500 text-sm mt-1">
                {errors.second_agent_percent.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Имя собственника</Label>
            <Input
              id="name"
              {...register("name", {
                required: "Это поле обязательно",
                minLength: { value: 3, message: "Минимум 3 символа" },
                maxLength: { value: 100, message: "Максимум 100 символов" },
              })}
              placeholder="Введите имя"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">
              Номер телефона собственника
            </Label>
            <Input
              id="phone_number"
              {...register("phone_number", {
                required: "Это поле обязательно",
                minLength: { value: 3, message: "Минимум 3 символа" },
                maxLength: { value: 13, message: "Максимум 13 символов" },
              })}
              placeholder="Введите номер телефона собственника"
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone_number.message}
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

        <div className="space-y-2">
          <Label htmlFor="furnished">Меблированная</Label>
          <Controller
            name="furnished"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ? "yes" : "no"}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Да</SelectItem>
            <SelectItem value="no">Нет</SelectItem>
          </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label htmlFor="media">Файлы (Изображения и Видео)</Label>
          <div
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
            onClick={() => fileInputRef.current?.click()} // Trigger file input on click
            onDrop={(e) => {
              e.preventDefault();
              const dt = new DataTransfer();
              for (const file of e.dataTransfer.files) {
                dt.items.add(file);
              }
              if (fileInputRef.current) {
                fileInputRef.current.files = dt.files;
                handleImageChange({ target: { files: dt.files } });
              }
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="media"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <span>Загрузить файлы</span>
                </label>
                <input
                  id="media"
                  type="file"
                  multiple
                  className="sr-only"
                  accept="image/*,video/*" // Accept both images and videos
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <p className="pl-1">или перетащите сюда</p>
              </div>
              <p className="text-xs text-gray-500">
                Поддерживаемые форматы: PNG, JPG, GIF (до 10MB), MP4, MOV (до
                50MB)
              </p>
            </div>
          </div>
          {previewImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {previewImages.map((media) => (
                <div key={media.id} className="relative">
                  {media.media_type === 'video' ? (
                    <video
                      src={media.url}
                      controls
                      className="w-full h-32 object-cover rounded-md"
                    />
                  ) : (
                    <Image
                      src={media.url}
                      alt={`Preview ${media.id}`}
                      width={150}
                      height={150}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  )}
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    onClick={() => removeImage(media.id)} // Pass the media ID
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
            "Обновить квартиру"
          )}
        </Button>
        {/* cancel */}
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

