'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface LandFilterValues {
  region: string
  title: string
  price: string
  rooms: string
  landArea: string
  livingArea: string
  totalFloors: string
  location: string
  furnished: string
  condition: string
  parking: string
  agent: string
}

interface FilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const regions = ['Мирзо Улугбек', 'Юнусабад', 'Чиланзар', 'Шайхантахур', 'Сергелий']
const locationTypes = [
  'В городе',
  'В пригороде',
  'В сельской местности',
  'Вдоль трассы',
  'Возле водоема',
  'В горах',
  'В дачном массиве',
  'На закрытой территории',
]
const agents = ['Акобир', 'Иван Иванов', 'Мария Смирнова']

export function LandFilterModal({ open, onOpenChange }: FilterModalProps) {
  const [filters, setFilters] = useState<LandFilterValues>({
    region: '',
    title: '',
    price: '',
    rooms: '',
    landArea: '',
    livingArea: '',
    totalFloors: '',
    location: '',
    furnished: '',
    condition: '',
    parking: '',
    agent: '',
  })

  const handleChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    console.log('Land Filter Query:', params.toString())
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Фильтр земельных участков</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Region and Title */}
          <div>
            <Label>Район</Label>
            <Select onValueChange={(value) => handleChange('region', value)} value={filters.region}>
              <SelectTrigger>
                <SelectValue placeholder="Районы Ташкента" />
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

          {/* Rooms and Land Area */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Количество комнат</Label>
              <Input
                placeholder="1/2/3/4/5/6"
                value={filters.rooms}
                onChange={(e) => handleChange('rooms', e.target.value)}
              />
            </div>
            <div>
              <Label>Площадь участка (м²)</Label>
              <Input
                type="number"
                placeholder="200"
                value={filters.landArea}
                onChange={(e) => handleChange('landArea', e.target.value)}
              />
            </div>
          </div>

          {/* Living Area */}
          <div>
            <Label>Жилая площадь (м²)</Label>
            <Input
              type="number"
              placeholder="200"
              value={filters.livingArea}
              onChange={(e) => handleChange('livingArea', e.target.value)}
            />
          </div>

          {/* Total Floors */}
          <div>
            <Label>Этажность</Label>
            <Input
              type="number"
              placeholder="23"
              value={filters.totalFloors}
              onChange={(e) => handleChange('totalFloors', e.target.value)}
            />
          </div>

          {/* Location */}
          <div>
            <Label>Расположение</Label>
            <Select onValueChange={(value) => handleChange('location', value)} value={filters.location}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите расположение" />
              </SelectTrigger>
              <SelectContent>
                {locationTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Furnished, Condition, Parking */}
          <div className="grid grid-cols-2 gap-4">
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

          <div>
            <Label>Парковочное место</Label>
            <Select onValueChange={(value) => handleChange('parking', value)} value={filters.parking}>
              <SelectTrigger>
                <SelectValue placeholder="Да/Нет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Да">Да</SelectItem>
                <SelectItem value="Нет">Нет</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agent */}
          <div>
            <Label>Агент</Label>
            <Select onValueChange={(value) => handleChange('agent', value)} value={filters.agent}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите агента" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent} value={agent}>
                    {agent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>Применить фильтр</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
