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
    propertyType?: 'Новостройка' | 'Вторичка'
    rooms?: string
    area?: string
    totalFloors?: string
    floor?: string
    bathroom?: string
    furnished?: 'Да' | 'Нет'
    condition?: string
    landArea?: string
    purpose?: string
    parking?: 'Да' | 'Нет'
    livingArea?: string // Add livingArea field
}

const AddPropertyForm: React.FC = () => {
    const { register, handleSubmit, control, formState: { errors }, watch } = useForm<FormData>()
    const [photos, setPhotos] = useState<string[]>([])
    const selectedCategory = watch('category')

    const onSubmit = (data: FormData) => {
        console.log(data)
        // Submit the form data to the backend
    }

    const addPhoto = () => {
        setPhotos([...photos, 'https://via.placeholder.com/150'])
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Детали Объекта</h2>
                    
                    {/* Common Fields */}
                    <div>
                        <Label htmlFor="district">Район</Label>
                        <Select onValueChange={(value) => console.log(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите район" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tashkent">Ташкент</SelectItem>
                                <SelectItem value="samarkand">Самарканд</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedCategory === 'Квартиры' && (
                    <div>
                        <Label htmlFor="metro">Метро</Label>
                        <Select onValueChange={(value) => console.log(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите метро" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="chilonzor">Чиланзар</SelectItem>
                                <SelectItem value="oybek">Ойбек</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    )}

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

                    {/* Photos */}
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
                        <Textarea id="description" {...register('description', { required: 'Описание обязательно' })} />
                        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="agentComment">Комментарий для агента</Label>
                        <Textarea id="agentComment" {...register('agentComment')} />
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
                    
                    {selectedCategory === 'Квартиры' && (
                    <div>
                        <Label>Тип жилья</Label>
                        <Controller
                            name="propertyType"
                            control={control}
                            rules={{ required: 'Тип жилья обязателен' }}
                            render={({ field }) => (
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
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
                    </div>
                        )}

                    {/* Dynamic Fields */}
                    
                    <div>
                        <div>
                            <Label htmlFor="rooms">Количество комнат</Label>
                            <Input id="rooms" {...register('rooms')} />
                        </div>
                        <div>
                            <Label htmlFor="area">Общая площадь (м²)</Label>
                            <Input id="area" {...register('area')} />
                        </div>
                        {selectedCategory === 'Участки' && (
                            <div>
                                <Label htmlFor="livingArea">Жилая площадь (м²)</Label>
                                <Input id="livingArea" {...register('livingArea')} />
                            </div>
                            
                        )}
                        <div>
                            <Label htmlFor="floor">Этаж</Label>
                            <Input id="floor" {...register('floor')} />
                        </div>

                        

                        <div>
                        <Label htmlFor="totalFloors">Этажность</Label>
                        <Input id="totalFloors" {...register('totalFloors')} />
                    </div>
                        <div>
                            <Label htmlFor="purpose">Расположение</Label>
                            <Input id="purpose" {...register('purpose')} />
                        </div>
                        {selectedCategory === 'Квартиры' && (
                        <div>
                            <Label htmlFor="bathroom">Санузел</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите тип санузла" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Раздельный">Раздельный</SelectItem>
                                    <SelectItem value="Совмещенный">Совмещенный</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        )}

                     
                        <div>
                            <Label htmlFor="furnished">Мебелированна</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Да">Да</SelectItem>
                                    <SelectItem value="Нет">Нет</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="condition">Состояние</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите состояние" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Евроремонт">Евроремонт</SelectItem>
                                    <SelectItem value="Среднее">Среднее</SelectItem>
                                    <SelectItem value="Требует ремонта">Требует ремонта</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {selectedCategory != 'Квартиры' && (
                                <div>
                                <Label htmlFor="parking">Парковочное место</Label>
                                <Select
                                    {...register('parking', { required: 'Выбор парковочного места обязателен' })}
                                    onValueChange={(value) => console.log(value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Да/Нет" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Да">Да</SelectItem>
                                        <SelectItem value="Нет">Нет</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.parking && <p className="text-red-500">{errors.parking.message}</p>}
                            </div>
                        )}
                    </div>
                        </div>
            </div>

            <Button type="submit" className="w-full">Сохранить</Button>
        </form>
    )
}

export default AddPropertyForm
