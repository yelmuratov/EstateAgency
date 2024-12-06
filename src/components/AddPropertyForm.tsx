'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface FormData {
  district: string
  metro: string
  name: string
  category: 'Квартиры' | 'Коммерция' | 'Участки'
  description: string
  agentComment: string
  price: string
  propertyType: 'Новостройка' | 'Вторичка'
  rooms: string
  area: string
  totalFloors: string
  floor: string
  bathroom: string
  furnished: 'Да' | 'Нет'
  condition: string
}

const AddPropertyForm: React.FC = () => {
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm<FormData>()
  const [photos, setPhotos] = useState<string[]>([])

  const onSubmit = (data: FormData) => {
    console.log(data)
    // Here you would typically send the data to your backend
  }

  const addPhoto = () => {
    setPhotos([...photos, 'https://via.placeholder.com/150'])
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Детали Объекта</h2>
          
          <div>
            <Label htmlFor="district">Район</Label>
            <Select onValueChange={(value) => console.log(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите район" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tashkent">Ташкент</SelectItem>
                <SelectItem value="samarkand">Самарканд</SelectItem>
                {/* Add more districts as needed */}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="metro">Метро</Label>
            <Select onValueChange={(value) => console.log(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите метро" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chilonzor">Чиланзар</SelectItem>
                <SelectItem value="oybek">Ойбек</SelectItem>
                {/* Add more metro stations as needed */}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              {...register('name', { required: 'Название обязательно' })}
              maxLength={50}
            />
            <p className="text-sm text-muted-foreground mt-1">
              {(watch('name')?.length || 0)}/50
            </p>
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Категории</Label>
            <Controller
              name="category"
              control={control}
              rules={{ required: 'Категория обязательна' }}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Квартиры" id="r1" />
                    <Label htmlFor="r1">Квартиры</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Коммерция" id="r2" />
                    <Label htmlFor="r2">Коммерция</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Участки" id="r3" />
                    <Label htmlFor="r3">Участки</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.category && <p className="text-red-500">{errors.category.message}</p>}
          </div>

          <div>
            <Label>Фото</Label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {photos.map((photo, index) => (
                <img key={index} src={photo} alt={`Property ${index + 1}`} className="w-full h-24 object-cover rounded" />
              ))}
              <Button type="button" onClick={addPhoto} className="h-24">
                Добавить фото
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Описание для клиента</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Описание обязательно' })}
              maxLength={6000}
              rows={4}
            />
            <p className="text-sm text-muted-foreground mt-1">
              {(watch('description')?.length || 0)}/6000
            </p>
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="agentComment">Комментарий для агента</Label>
            <Textarea
              id="agentComment"
              {...register('agentComment')}
              rows={4}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Дополнительная Информация</h2>
          
          <div>
            <Label htmlFor="price">Цена</Label>
            <Input
              id="price"
              {...register('price', { required: 'Цена обязательна' })}
              placeholder="300000$"
            />
            {errors.price && <p className="text-red-500">{errors.price.message}</p>}
          </div>

          <div>
            <Label>Тип жилья</Label>
            <Controller
              name="propertyType"
              control={control}
              rules={{ required: 'Тип жилья обязателен' }}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Новостройка" id="r4" />
                    <Label htmlFor="r4">Новостройка</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Вторичка" id="r5" />
                    <Label htmlFor="r5">Вторичка</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.propertyType && <p className="text-red-500">{errors.propertyType.message}</p>}
          </div>

          <div>
            <Label htmlFor="rooms">Количество комнат</Label>
            <Select onValueChange={(value) => console.log(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите количество комнат" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="area">Общая площадь (м²)</Label>
            <Input
              id="area"
              {...register('area', { required: 'Площадь обязательна' })}
            />
            {errors.area && <p className="text-red-500">{errors.area.message}</p>}
          </div>

          <div>
            <Label htmlFor="totalFloors">Этажность</Label>
            <Input
              id="totalFloors"
              {...register('totalFloors', { required: 'Этажность обязательна' })}
              placeholder="23"
            />
            {errors.totalFloors && <p className="text-red-500">{errors.totalFloors.message}</p>}
          </div>

          <div>
            <Label htmlFor="floor">Этаж</Label>
            <Input
              id="floor"
              {...register('floor', { required: 'Этаж обязателен' })}
              placeholder="10"
            />
            {errors.floor && <p className="text-red-500">{errors.floor.message}</p>}
          </div>

          <div>
            <Label htmlFor="bathroom">Санузел</Label>
            <Select onValueChange={(value) => console.log(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип санузла" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="separate">Раздельный</SelectItem>
                <SelectItem value="combined">Совмещенный</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="furnished">Мебелированна</Label>
            <Select onValueChange={(value) => console.log(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Да</SelectItem>
                <SelectItem value="no">Нет</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="condition">Состояние</Label>
            <Select onValueChange={(value) => console.log(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите состояние" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="euro">Евроремонт</SelectItem>
                <SelectItem value="average">Среднее</SelectItem>
                <SelectItem value="needs-repair">Требует ремонта</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">Сохранить</Button>
    </form>
  )
}

export default AddPropertyForm

