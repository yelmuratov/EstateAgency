'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FilterValues {
  region: string
  metro: string
  title: string
  price: string
  housingType: string
  rooms: string
  area: string
  totalFloors: string
  floor: string
  bathroom: string
  furnished: string
  condition: string
}

interface PropertyFilterProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const regions = ['Мирзо Улугбек', 'Юнусабад', 'Чиланзар', 'Шайхантахур', 'Сергелий']
const metroStations = ['Буюк Ипак Йули', 'Минор', 'Хамид Алимжан', 'Чорсу', 'Алишер Навои']

export function PropertyFilter({ open, onOpenChange }: PropertyFilterProps) {
  const [filters, setFilters] = useState<FilterValues>({
    region: '',
    metro: '',
    title: '',
    price: '',
    housingType: '',
    rooms: '',
    area: '',
    totalFloors: '',
    floor: '',
    bathroom: '',
    furnished: '',
    condition: '',
  })

  const handleChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    console.log('Applied Filters:', params.toString())
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Фильтр недвижимости</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Region and Metro */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Район</Label>
              <Select onValueChange={(value) => handleChange('region', value)} value={filters.region}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите район" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Метро</Label>
              <Select onValueChange={(value) => handleChange('metro', value)} value={filters.metro}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите станцию метро" />
                </SelectTrigger>
                <SelectContent>
                  {metroStations.map((station) => (
                    <SelectItem key={station} value={station}>
                      {station}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label>Название</Label>
            <Input
              placeholder="Проспект Амир Темур 5/5/2"
              value={filters.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>

          {/* Price */}
          <div>
            <Label>Цена</Label>
            <Input
              type="number"
              placeholder="300000$"
              value={filters.price}
              onChange={(e) => handleChange('price', e.target.value)}
            />
          </div>

          {/* Housing Type */}
          <div>
            <Label>Тип жилья</Label>
            <Select onValueChange={(value) => handleChange('housingType', value)} value={filters.housingType}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Новостройка">Новостройка</SelectItem>
                <SelectItem value="Вторичка">Вторичка</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rooms */}
          <div>
            <Label>Количество комнат</Label>
            <Input
              placeholder="1/2/3/4/5/6"
              value={filters.rooms}
              onChange={(e) => handleChange('rooms', e.target.value)}
            />
          </div>

          {/* Area */}
          <div>
            <Label>Общая площадь (м²)</Label>
            <Input
              type="number"
              placeholder="200"
              value={filters.area}
              onChange={(e) => handleChange('area', e.target.value)}
            />
          </div>

          {/* Total Floors and Current Floor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Этажность</Label>
              <Input
                type="number"
                placeholder="23"
                value={filters.totalFloors}
                onChange={(e) => handleChange('totalFloors', e.target.value)}
              />
            </div>
            <div>
              <Label>Этаж</Label>
              <Input
                type="number"
                placeholder="10"
                value={filters.floor}
                onChange={(e) => handleChange('floor', e.target.value)}
              />
            </div>
          </div>

          {/* Bathroom */}
          <div>
            <Label>Санузел</Label>
            <Select onValueChange={(value) => handleChange('bathroom', value)} value={filters.bathroom}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Раздельный">Раздельный</SelectItem>
                <SelectItem value="Совмещенный">Совмещенный</SelectItem>
                <SelectItem value="2 и более">2 и более</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Furnished */}
          <div>
            <Label>Меблирован</Label>
            <Select onValueChange={(value) => handleChange('furnished', value)} value={filters.furnished}>
              <SelectTrigger>
                <SelectValue placeholder="Да/Нет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Да">Да</SelectItem>
                <SelectItem value="Нет">Нет</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Condition */}
          <div>
            <Label>Состояние</Label>
            <Select onValueChange={(value) => handleChange('condition', value)} value={filters.condition}>
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>Применить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
