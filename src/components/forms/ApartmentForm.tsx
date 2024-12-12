'use client'

import { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import api  from '@/lib/api'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from 'lucide-react'

interface ApartmentFormData {
  district: string;
  metro_st: string;
  title: string;
  category: 'apartment';
  action_type: 'rent' | 'sale';
  description?: string;
  comment?: string;
  price: number;
  house_type: 'new_building' | 'secondary';
  rooms: number;
  square_area: number;
  floor_number: number;
  floor: number;
  bathroom: 'seperated' | 'combined' | 'many';
  furnished: boolean;
  house_condition: 'euro' | 'normal' | 'repair';
  current_status: 'free' | 'soon' | 'busy';
  name: string;
  phone_number: string;
  agent_percent: number;
  agent_commission?: number;
  crm_id?: string;
  responsible?: string;
  images: FileList;
}

export default function ApartmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const { register, handleSubmit, control, formState: { errors } } = useForm<ApartmentFormData>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (data: ApartmentFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images') {
          for (let i = 0; i < value.length; i++) {
            formData.append('images', value[i]);
          }
        } else if (key === 'furnished') {
          formData.append(key, value ? 'true' : 'false');
        } else {
          formData.append(key, value as string | Blob);
        }
      });

      await api.post('/apartment/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Квартира успешно добавлена!');
      setPreviewImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Произошла ошибка при добавлении квартиры. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Label htmlFor="district">Район</Label>
        <Input
          id="district"
          {...register('district', { required: 'Это поле обязательно' })}
          placeholder="Введите район"
          className="mt-1 w-full"
        />
        {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>}
      </div>

      <div>
        <Label htmlFor="metro_st">Метро</Label>
        <Input
          id="metro_st"
          {...register('metro_st', { required: 'Это поле обязательно' })}
          placeholder="Введите ближайшее метро"
        />
        {errors.metro_st && <p className="text-red-500 text-sm mt-1">{errors.metro_st.message}</p>}
      </div>

      <div>
        <Label htmlFor="title">Название</Label>
        <Input
          id="title"
          {...register('title', { 
            required: 'Это поле обязательно', 
            minLength: { value: 3, message: 'Минимум 3 символа' },
            maxLength: { value: 50, message: 'Максимум 50 символов' }
          })}
          placeholder="Введите название"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="category">Категория</Label>
        <Controller
          name="category"
          control={control}
          defaultValue="apartment"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Квартира</SelectItem>
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
          rules={{ required: 'Это поле обязательно' }}
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
        {errors.action_type && <p className="text-red-500 text-sm mt-1">{errors.action_type.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          {...register('description', { maxLength: { value: 6000, message: 'Максимум 6000 символов' } })}
          placeholder="Введите описание (необязательно)"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <Label htmlFor="comment">Комментарий</Label>
        <Textarea
          id="comment"
          {...register('comment', { maxLength: { value: 6000, message: 'Максимум 6000 символов' } })}
          placeholder="Введите комментарий (необязательно)"
        />
        {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>}
      </div>

      <div>
        <Label htmlFor="price">Цена</Label>
        <Input
          id="price"
          type="number"
          {...register('price', { required: 'Это поле обязательно', valueAsNumber: true })}
          placeholder="Введите цену"
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
      </div>

      <div>
        <Label htmlFor="house_type">Тип жилья</Label>
        <Controller
          name="house_type"
          control={control}
          rules={{ required: 'Это поле обязательно' }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        {errors.house_type && <p className="text-red-500 text-sm mt-1">{errors.house_type.message}</p>}
      </div>

      <div>
        <Label htmlFor="rooms">Количество комнат</Label>
        <Input
          id="rooms"
          type="number"
          {...register('rooms', { required: 'Это поле обязательно', valueAsNumber: true })}
          placeholder="Введите количество комнат"
        />
        {errors.rooms && <p className="text-red-500 text-sm mt-1">{errors.rooms.message}</p>}
      </div>

      <div>
        <Label htmlFor="square_area">Общая площадь</Label>
        <Input
          id="square_area"
          type="number"
          {...register('square_area', { required: 'Это поле обязательно', valueAsNumber: true })}
          placeholder="Введите общую площадь"
        />
        {errors.square_area && <p className="text-red-500 text-sm mt-1">{errors.square_area.message}</p>}
      </div>

      <div>
        <Label htmlFor="floor_number">Этажность</Label>
        <Input
          id="floor_number"
          type="number"
          {...register('floor_number', { required: 'Это поле обязательно', valueAsNumber: true })}
          placeholder="Введите этажность дома"
        />
        {errors.floor_number && <p className="text-red-500 text-sm mt-1">{errors.floor_number.message}</p>}
      </div>

      <div>
        <Label htmlFor="floor">Этаж</Label>
        <Input
          id="floor"
          type="number"
          {...register('floor', { required: 'Это поле обязательно', valueAsNumber: true })}
          placeholder="Введите этаж квартиры"
        />
        {errors.floor && <p className="text-red-500 text-sm mt-1">{errors.floor.message}</p>}
      </div>

      <div>
        <Label htmlFor="bathroom">Санузел</Label>
        <Controller
          name="bathroom"
          control={control}
          rules={{ required: 'Это поле обязательно' }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        {errors.bathroom && <p className="text-red-500 text-sm mt-1">{errors.bathroom.message}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Controller
          name="furnished"
          control={control}
          defaultValue={true}
          render={({ field }) => (
            <Checkbox
              id="furnished"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="furnished">Меблированная</Label>
      </div>

      <div>
        <Label htmlFor="house_condition">Состояние</Label>
        <Controller
          name="house_condition"
          control={control}
          rules={{ required: 'Это поле обязательно' }}
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
        {errors.house_condition && <p className="text-red-500 text-sm mt-1">{errors.house_condition.message}</p>}
      </div>

      <div>
        <Label htmlFor="current_status">Текущий статус</Label>
        <Controller
          name="current_status"
          control={control}
          rules={{ required: 'Это поле обязательно' }}
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
        {errors.current_status && <p className="text-red-500 text-sm mt-1">{errors.current_status.message}</p>}
      </div>

      <div>
        <Label htmlFor="name">Имя</Label>
        <Input
          id="name"
          {...register('name', { 
            required: 'Это поле обязательно', 
            minLength: { value: 3, message: 'Минимум 3 символа' },
            maxLength: { value: 100, message: 'Максимум 100 символов' }
          })}
          placeholder="Введите имя"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="phone_number">Номер телефона</Label>
        <Input
          id="phone_number"
          {...register('phone_number', { 
            required: 'Это поле обязательно', 
            minLength: { value: 3, message: 'Минимум 3 символа' },
            maxLength: { value: 13, message: 'Максимум 13 символов' }
          })}
          placeholder="Введите номер телефона"
        />
        {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>}
      </div>

      <div>
        <Label htmlFor="agent_percent">Процент агента</Label>
        <Input
          id="agent_percent"
          type="number"
          {...register('agent_percent', { required: 'Это поле обязательно', valueAsNumber: true })}
          placeholder="Введите процент агента"
        />
        {errors.agent_percent && <p className="text-red-500 text-sm mt-1">{errors.agent_percent.message}</p>}
      </div>

      <div>
        <Label htmlFor="agent_commission">Комиссия агента</Label>
        <Input
          id="agent_commission"
          type="number"
          {...register('agent_commission', { valueAsNumber: true })}
          placeholder="Введите комиссию агента (необязательно)"
        />
        {errors.agent_commission && <p className="text-red-500 text-sm mt-1">{errors.agent_commission.message}</p>}
      </div>

      <div>
        <Label htmlFor="crm_id">CRM ID</Label>
        <Input
          id="crm_id"
          {...register('crm_id', { maxLength: { value: 255, message: 'Максимум 255 символов' } })}
          placeholder="Введите CRM ID (необязательно)"
        />
        {errors.crm_id && <p className="text-red-500 text-sm mt-1">{errors.crm_id.message}</p>}
      </div>

      <div>
        <Label htmlFor="responsible">Ответственный</Label>
        <Input
          id="responsible"
          {...register('responsible', { 
            minLength: { value: 3, message: 'Минимум 3 символа' },
            maxLength: { value: 100, message: 'Максимум 100 символов' }
          })}
          placeholder="Введите ответственного (необязательно)"
        />
        {errors.responsible && <p className="text-red-500 text-sm mt-1">{errors.responsible.message}</p>}
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
                  {...register('images')}
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
                <img src={image} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={16} />
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
            Сохранение...
          </>
        ) : (
          'Добавить квартиру'
        )}
      </Button>
    </form>
  );
}

