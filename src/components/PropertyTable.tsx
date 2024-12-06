import React from 'react'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface Property {
  id: string
  image: string
  name: string
  price: string
  type: string
  createdAt: string
  agent: string
  status: 'Свободный' | 'Скоро' | 'Занят'
  area: string
  contact: string
}

const properties: Property[] = [
  {
    id: '1',
    image: '/placeholder.svg',
    name: 'Уютная квартира в центре',
    price: '1000$',
    type: 'Квартира Новостройка',
    createdAt: '2023-05-01',
    agent: 'Иван Иванов',
    status: 'Свободный',
    area: '45 M2',
    contact: '901834922',
  },
  // Add more sample data here
]

const statusColors = {
  'Свободный': 'bg-green-500',
  'Скоро': 'bg-yellow-500',
  'Занят': 'bg-red-500',
}

const PropertyTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Превью</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead className="hidden md:table-cell">Тип Недвижимости</TableHead>
            <TableHead className="hidden lg:table-cell">Дата Создания</TableHead>
            <TableHead className="hidden lg:table-cell">Агент</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="hidden md:table-cell">Площадь</TableHead>
            <TableHead className="hidden lg:table-cell">Контакты</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id}>
              <TableCell>
                <Image src={property.image} alt={property.name} width={50} height={50} className="rounded-md" />
              </TableCell>
              <TableCell className="font-medium">{property.name}</TableCell>
              <TableCell>{property.price}</TableCell>
              <TableCell className="hidden md:table-cell">{property.type}</TableCell>
              <TableCell className="hidden lg:table-cell">{property.createdAt}</TableCell>
              <TableCell className="hidden lg:table-cell">{property.agent}</TableCell>
              <TableCell>
                <Badge className={statusColors[property.status]}>{property.status}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{property.area}</TableCell>
              <TableCell className="hidden lg:table-cell">{property.contact}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default PropertyTable

