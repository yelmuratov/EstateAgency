'use client'

import React, { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LandFormData } from '@/types/LandFormData'
import { Loader2, Upload, X } from 'lucide-react'

const schema = z.object({
  district: z.string().nonempty('Это поле обязательно'),
  title: z.string().min(3, 'Минимум 3 символа').max(50, 'Максимум 50 символов').nonempty('Это поле обязательно'),
  category: z.literal('land'),
  action_type: z.enum(['rent', 'sale'], { required_error: 'Это поле обязательно' }),
  description: z.string().max(6000, 'Максимум 6000 символов').optional(),
  comment: z.string().max(6000, 'Максимум 6000 символов').optional(),
  price: z.number().int().positive('Цена должна быть положительным числом').refine(value => value !== undefined, { message: 'Это поле обязательно' }),
  rooms: z.number().int().positive('Количество комнат должно быть положительным числом').refine(value => value !== undefined, { message: 'Это поле обязательно' }),
  square_area: z.number().int().positive('Площадь должна быть положительным числом').refine(value => value !== undefined, { message: 'Это поле обязательно' }),
  live_square_area: z.number().int().positive('Жилая площадь должна быть положительным числом').refine(value => value !== undefined, { message: 'Это поле обязательно' }),
  floor_number: z.number().int().positive('Этажность должна быть положительным числом').refine(value => value !== undefined, { message: 'Это поле обязательно' }),
  location: z.enum(['city', 'suburb', 'countryside', 'along_road', 'near_pond', 'foothills', 'cottage_area', 'closed_area'], { required_error: 'Это поле обязательно' }),
  furnished: z.boolean().optional(),
  house_condition: z.enum(['euro', 'normal', 'repair'], { required_error: 'Это поле обязательно' }),
  current_status: z.enum(['free', 'soon', 'busy']).optional(),
  parking_place: z.boolean({ required_error: 'Это поле обязательно' }),
  agent_percent: z.number().int().min(0, 'Процент агента не может быть отрицательным').max(100, 'Процент агента не может быть больше 100').refine(value => value !== undefined, { message: 'Это поле обязательно' }),
  agent_commission: z.number().optional(),
  crm_id: z.string().max(255, 'Максимум 255 символов').optional(),
  responsible: z.string().min(3, 'Минимум 3 символа').max(100, 'Максимум 100 символов').optional(),
  media: z.instanceof(FileList).optional(),
})

export function LandPropertyForm() {
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LandFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: 'land',
      furnished: true,
    },
  })

  const onSubmit = async (data: LandFormData) => {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'media') {
          for (let i = 0; i < value.length; i++) {
            formData.append('media', value[i])
          }
        } else {
          formData.append(key, value as string | Blob)
        }
      })

      await axios.post('/land/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      // Handle success (e.g., show a success message, reset form, etc.)
      setPreviewImages([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error submitting form:', error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newPreviewImages: string[] = []
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviewImages.push(e.target.result as string)
            if (newPreviewImages.length === files.length) {
              setPreviewImages(newPreviewImages)
            }
          }
        }
        reader.readAsDataURL(files[i])
      }
    }
  }

  const removeImage = (index: number) => {
    const newPreviewImages = [...previewImages]
    newPreviewImages.splice(index, 1)
    setPreviewImages(newPreviewImages)

    if (fileInputRef.current && fileInputRef.current.files) {
      const dt = new DataTransfer()
      const { files } = fileInputRef.current
      for (let i = 0; i < files.length; i++) {
        if (i !== index) {
          dt.items.add(files[i])
        }
      }
      fileInputRef.current.files = dt.files
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label htmlFor="district" className="block text-sm font-medium text-gray-700">
          Район
        </label>
        <Input
          id="district"
          {...register('district')}
          placeholder="Введите район"
          className="mt-1 w-full"
        />
        {errors.district && (
          <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Название
        </label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Введите название"
          className="mt-1"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="action_type" className="block text-sm font-medium text-gray-700">
          Тип действия
        </label>
        <Controller
          name="action_type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="mt-1">
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
          <p className="mt-1 text-sm text-red-600">{errors.action_type.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Описание
        </label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Введите описание"
          className="mt-1"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Комментарий
        </label>
        <Textarea
          id="comment"
          {...register('comment')}
          placeholder="Введите комментарий"
          className="mt-1"
        />
        {errors.comment && (
          <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Цена
        </label>
        <Input
          id="price"
          type="number"
          {...register('price', { valueAsNumber: true })}
          placeholder="Введите цену"
          className="mt-1"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
          Количество комнат
        </label>
        <Input
          id="rooms"
          type="number"
          {...register('rooms', { valueAsNumber: true })}
          placeholder="Введите количество комнат"
          className="mt-1"
        />
        {errors.rooms && (
          <p className="mt-1 text-sm text-red-600">{errors.rooms.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="square_area" className="block text-sm font-medium text-gray-700">
          Общая площадь
        </label>
        <Input
          id="square_area"
          type="number"
          {...register('square_area', { valueAsNumber: true })}
          placeholder="Введите общую площадь"
          className="mt-1"
        />
        {errors.square_area && (
          <p className="mt-1 text-sm text-red-600">{errors.square_area.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="live_square_area" className="block text-sm font-medium text-gray-700">
          Жилая площадь
        </label>
        <Input
          id="live_square_area"
          type="number"
          {...register('live_square_area', { valueAsNumber: true })}
          placeholder="Введите жилую площадь"
          className="mt-1"
        />
        {errors.live_square_area && (
          <p className="mt-1 text-sm text-red-600">{errors.live_square_area.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="floor_number" className="block text-sm font-medium text-gray-700">
          Этажность
        </label>
        <Input
          id="floor_number"
          type="number"
          {...register('floor_number', { valueAsNumber: true })}
          placeholder="Введите этажность"
          className="mt-1"
        />
        {errors.floor_number && (
          <p className="mt-1 text-sm text-red-600">{errors.floor_number.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Расположение
        </label>
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="mt-1">
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
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="furnished" className="block text-sm font-medium text-gray-700">
          Меблированная
        </label>
        <Controller
          name="furnished"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Выберите наличие мебели" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Да</SelectItem>
                <SelectItem value="false">Нет</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.furnished && (
          <p className="mt-1 text-sm text-red-600">{errors.furnished.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="house_condition" className="block text-sm font-medium text-gray-700">
          Состояние
        </label>
        <Controller
          name="house_condition"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Выберите состояние" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="euro">Евроремонт</SelectItem>
                <SelectItem value="normal">Среднее</SelectItem>
                <SelectItem value="repair">Требует ремонта</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.house_condition && (
          <p className="mt-1 text-sm text-red-600">{errors.house_condition.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="current_status" className="block text-sm font-medium text-gray-700">
          Текущий статус
        </label>
        <Controller
          name="current_status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Выберите текущий статус" />
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
          <p className="mt-1 text-sm text-red-600">{errors.current_status.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="parking_place" className="block text-sm font-medium text-gray-700">
          Парковка
        </label>
        <Controller
          name="parking_place"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Выберите наличие парковки" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Да</SelectItem>
                <SelectItem value="false">Нет</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.parking_place && (
          <p className="mt-1 text-sm text-red-600">{errors.parking_place.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="agent_percent" className="block text-sm font-medium text-gray-700">
          Процент агента
        </label>
        <Input
          id="agent_percent"
          type="number"
          {...register('agent_percent', { valueAsNumber: true })}
          placeholder="Введите процент агента"
          className="mt-1"
        />
        {errors.agent_percent && (
          <p className="mt-1 text-sm text-red-600">{errors.agent_percent.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="agent_commission" className="block text-sm font-medium text-gray-700">
          Комиссия агента
        </label>
        <Input
          id="agent_commission"
          type="number"
          {...register('agent_commission', { valueAsNumber: true })}
          placeholder="Введите комиссию агента"
          className="mt-1"
        />
        {errors.agent_commission && (
          <p className="mt-1 text-sm text-red-600">{errors.agent_commission.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="crm_id" className="block text-sm font-medium text-gray-700">
          CRM ID
        </label>
        <Input
          id="crm_id"
          {...register('crm_id')}
          placeholder="Введите CRM ID"
          className="mt-1"
        />
        {errors.crm_id && (
          <p className="mt-1 text-sm text-red-600">{errors.crm_id.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="responsible" className="block text-sm font-medium text-gray-700">
          Ответственный
        </label>
        <Input
          id="responsible"
          {...register('responsible')}
          placeholder="Введите ответственного"
          className="mt-1"
        />
        {errors.responsible && (
          <p className="mt-1 text-sm text-red-600">{errors.responsible.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="media" className="block text-sm font-medium text-gray-700">
          Фотографии
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="media"
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Загрузить файлы</span>
                <input
                  id="media"
                  type="file"
                  className="sr-only"
                  multiple
                  {...register('media')}
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
        {isSubmitting ? 'Сохранение...' : 'Сохранить'}
      </Button>
    </form>
  )
}

