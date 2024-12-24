"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2, Upload, X } from 'lucide-react';
import usePropertyStore from "@/store/MetroDistrict/propertyStore";
import { useRouter } from "next/navigation";
import {
  validateFile,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
} from "@/utils/file-validation";
import { format } from "date-fns";
import { CalendarIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { UserStore } from "@/store/users/userStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
  parking_place: string;
  agent_percent: number;
  agent_commission?: number;
  crm_id?: string;
  responsible?: string;
  media?: FileList;
  status_date: string;
  second_responsible: string;
  second_agent_percent?: number;
  deal?: boolean;
}

export default function CommercialPropertyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CommercialFormData>({
    defaultValues: {
      category: "commercial",
      furnished: true,
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { districts, fetchDistricts } = usePropertyStore();
  const { users, fetchUsers } = UserStore();

  useEffect(() => {
    fetchDistricts();
    fetchUsers();
    return () => {
      // Cleanup video URLs when component unmounts
      previewImages.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [previewImages, fetchDistricts, fetchUsers]);

  const onSubmit = async (data: CommercialFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append media files to FormData
      if (mediaFiles && mediaFiles.length > 0) {
        for (let i = 0; i < mediaFiles.length; i++) {
          formData.append("media", mediaFiles[i]);
        }
      }

      // Append query parameters
      const params = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "" && !Number.isNaN(value)) {
          params.append(key, value.toString());
        }
      });

      setIsSubmitting(true);
      // Send API request
      await api.post(
        `/commercial/?${params.toString()}`,
        mediaFiles && mediaFiles.length > 0 ? formData : null,
        {
          headers: {
            "Content-Type":
              mediaFiles && mediaFiles.length > 0
                ? "multipart/form-data"
                : "application/x-www-form-urlencoded",
          },
        }
      );

      // Show success notification
      toast({
        title: "Успех",
        description: "Коммерческая недвижимость успешно добавлена.",
        variant: "default",
      });

      setIsSubmitting(false);
      // Reset form state
      reset();
      setPreviewImages([]);
      setMediaFiles(null);
      // Redirect to the dashboard
      router.push("/");
    } catch (error) {
      const apiError = error as {
        code?: string;
        response?: {
          status?: number;
          data?: {
            detail?: string | { loc: string[]; msg: string }[];
            message?: string;
          };
        };
      };

      const statusCode = apiError.response?.status;
      const errorDetail = apiError.response?.data?.detail;
      const isTimeout = apiError.code === "ECONNABORTED";

      if (isTimeout) {
        toast({
          title: "Ошибка тайм-аута",
          description:
            "Запрос занял слишком много времени. Попробуйте еще раз.",
          variant: "destructive",
          action: (
            <button
              onClick={() => handleSubmit(onSubmit)()} // Retry submission
              className="text-sm font-medium text-blue-500 hover:underline"
            >
              Повторить
            </button>
          ),
        });
      } else if (!apiError.response) {
        toast({
          title: "Сетевая ошибка",
          description:
            "Не удалось подключиться к серверу. Проверьте соединение и повторите попытку.",
          variant: "destructive",
        });
      } else if (statusCode === 400 || statusCode === 422) {
        if (typeof errorDetail === "string") {
          toast({
            title: "Ошибка валидации",
            description: errorDetail,
            variant: "destructive",
          });
        } else if (Array.isArray(errorDetail)) {
          const formattedErrors = (
            errorDetail as { loc: string[]; msg: string }[]
          )
            .map((err) => `- ${err.loc.join(" -> ")}: ${err.msg}`)
            .join("\n");

          toast({
            title: "Ошибка валидации",
            description: `Обнаружены следующие проблемы:\n${formattedErrors}`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Ошибка валидации",
            description: "Отправлены неверные данные.",
            variant: "destructive",
          });
        }
      } else if (statusCode && statusCode >= 500 && statusCode < 600) {
        toast({
          title: "Ошибка сервера",
          description: "На сервере произошла ошибка. Попробуйте позже.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Неизвестная ошибка",
          description:
            apiError.response?.data?.message || "Произошла неизвестная ошибка.",
          variant: "destructive",
        });
      } // Ensure the submitting state is reset
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
  
    const newPreviewImages: string[] = [...previewImages]; // Preserve existing previews
    const newMediaFiles = mediaFiles ? Array.from(mediaFiles) : []; // Preserve existing media files
  
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviewImages.push(e.target.result as string);
            setPreviewImages([...newPreviewImages]); // Update state with appended previews
          }
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        const videoUrl = URL.createObjectURL(file);
        newPreviewImages.push(videoUrl);
        setPreviewImages([...newPreviewImages]); // Update state with appended previews
      }
  
      newMediaFiles.push(file); // Add the file to the preserved list
    });
  
    const dt = new DataTransfer();
    newMediaFiles.forEach((file) => dt.items.add(file)); // Create new FileList
    setMediaFiles(dt.files); // Update media files state
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
      setMediaFiles(dt.files); 
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
          defaultValue="commercial"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="commercial">
                  Коммерческая недвижимость
                </SelectItem>
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

      <div>
        <Label htmlFor="current_status">Текущий статус</Label>
        <Controller
          name="current_status"
          control={control}
          rules={{ required: "Это поле обязательно" }}
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

      <div>
        <Label htmlFor="parking_place">Парковка</Label>
        <Controller
          name="parking_place"
          control={control}
          rules={{
            required: "Это поле обязательно",
            validate: (value) =>
              value === "true" ||
              value === "false" ||
              "Пожалуйста, выберите значение",
          }}
          defaultValue={""} // Ensure no pre-selected value
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите парковку" />
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
                  user.id !== null && (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.full_name}
                    </SelectItem>
                  )
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
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

      <div>
        <Label htmlFor="deal">Сделка</Label>
        <Controller
          name="deal"
          control={control}
          defaultValue={false}
          render={({ field }) => (
        <Select
          onValueChange={(value) => field.onChange(value === "true")}
          defaultValue={field.value ? "true" : "false"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите сделку" />
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
        <Label htmlFor="images">Фотографии</Label>
        <div
          className="mt-1 relative"
          onClick={() => fileInputRef.current?.click()} // Trigger file input on click
          onDrop={(e) => {
            e.preventDefault();
            const droppedFiles = Array.from(e.dataTransfer.files);
            const validFiles: File[] = [];
            const errors: string[] = [];
  
            droppedFiles.forEach((file) => {
              const { isValid, error } = validateFile(file);
              if (isValid) {
                validFiles.push(file);
              } else if (error) {
                errors.push(error);
              }
            });
  
            if (errors.length > 0) {
              toast({
                title: "Ошибка загрузки",
                description: errors.join("\n"),
                variant: "destructive",
              });
            }
  
            if (validFiles.length > 0) {
              const dt = new DataTransfer();
              validFiles.forEach((file) => dt.items.add(file));
              if (fileInputRef.current) {
                fileInputRef.current.files = dt.files;
                handleImageChange({ target: { files: dt.files } } as React.ChangeEvent<HTMLInputElement>);
              }
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("border-primary");
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("border-primary");
          }}
        >
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors duration-200 ease-in-out hover:border-primary">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="images"
                  className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary dark:text-primary-light hover:text-primary/80 dark:hover:text-primary-light/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                >
                  <span>Загрузить файлы</span>
                </label>
                <p className="pl-1">или перетащите сюда</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Изображения (до 5MB): PNG, JPG, GIF
                <br />
                Видео (до 30MB): MP4, MOV, AVI
              </p>
            </div>
          </div>
          <input
            id="images"
            type="file"
            className="sr-only"
            multiple
            accept={[...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES].join(",")}
            ref={fileInputRef}
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                const validFiles: File[] = [];
                const errors: string[] = [];
  
                Array.from(files).forEach((file) => {
                  const { isValid, error } = validateFile(file);
                  if (isValid) {
                    validFiles.push(file);
                  } else if (error) {
                    errors.push(error);
                  }
                });
  
                if (errors.length > 0) {
                  toast({
                    title: "Ошибка загрузки",
                    description: errors.join("\n"),
                    variant: "destructive",
                  });
                }
  
                if (validFiles.length > 0) {
                  const dt = new DataTransfer();
                  validFiles.forEach((file) => dt.items.add(file));
                  e.target.files = dt.files;
                  handleImageChange(e);
                }
              }
            }}
          />
        </div>
        {previewImages.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {previewImages.map((preview, index) => {
              const isVideo =
                mediaFiles && mediaFiles[index]?.type.startsWith("video/");
              return (
                <div key={index} className="relative group">
                  {isVideo ? (
                    <video
                      src={preview}
                      className="object-cover rounded-lg h-32 w-full"
                      controls
                    />
                  ) : (
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      width={200}
                      height={200}
                      className="object-cover rounded-lg h-32 w-full"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
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
          "Добавить коммерческую недвижимость"
        )}
      </Button>
    </form>
  );
}

