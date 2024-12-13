'use client'

import { useState } from "react"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface Property {
  id: number;
  image: string;
  title: string;
  district: string;
  price: number;
  propertyType: string;
  createdAt: string;
  agent: string;
  status: "free" | "soon" | "busy";
  area: string;
  contact: string;
  metro_st: string;
  action_type: "rent" | "sale";
  rooms: number;
  floor: number;
  floor_number: number;
}

const statusConfig = {
  free: { label: "Свободный", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  soon: { label: "Скоро", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  busy: { label: "Занят", className: "bg-red-100 text-red-800 hover:bg-red-100" },
}

export default function PropertyTable() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const properties: Property[] = [
    {
      id: 1,
      image: "/placeholder.svg?height=80&width=120",
      title: "Проспект Амира Темура 5/5/2",
      district: "Яккасарайский Район",
      price: 1000,
      propertyType: "Квартира Новостройка",
      createdAt: "28.11.2024",
      agent: "Евгений",
      status: "free",
      area: "45 M2",
      contact: "901834922",
      metro_st: "Чиланзар",
      action_type: "rent",
      rooms: 3,
      floor: 5,
      floor_number: 12
    }
  ]

  const toggleRow = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    )
    setSelectedProperty(
      properties.find(property => property.id === id) || null
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[50px]">
                <Checkbox />
              </TableHead>
              <TableHead>ПРЕВЬЮ</TableHead>
              <TableHead>НАЗВАНИЕ</TableHead>
              <TableHead>ЦЕНА</TableHead>
              <TableHead>ТИП НЕДВИЖИМОСТИ</TableHead>
              <TableHead>ДАТА СОЗДАНИЯ</TableHead>
              <TableHead>АГЕНТ</TableHead>
              <TableHead>СТАТУС</TableHead>
              <TableHead>ПЛОЩАДЬ</TableHead>
              <TableHead>КОНТАКТЫ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow 
                key={property.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleRow(property.id)}
              >
                <TableCell>
                  <Checkbox 
                    checked={selectedRows.includes(property.id)}
                    onCheckedChange={() => toggleRow(property.id)}
                  />
                </TableCell>
                <TableCell>
                  <Image
                    src={property.image}
                    alt={property.title}
                    width={80}
                    height={60}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{property.title}</div>
                    <div className="text-sm text-blue-500">{property.district}</div>
                  </div>
                </TableCell>
                <TableCell>${property.price}</TableCell>
                <TableCell>{property.propertyType}</TableCell>
                <TableCell>{property.createdAt}</TableCell>
                <TableCell>{property.agent}</TableCell>
                <TableCell>
                  <Badge className={statusConfig[property.status].className}>
                    {statusConfig[property.status].label}
                  </Badge>
                </TableCell>
                <TableCell>{property.area}</TableCell>
                <TableCell>{property.contact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedProperty && (
        <Card className="p-6 bg-gray-50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>Название: {selectedProperty.title}</div>
            <div>Район: {selectedProperty.district}</div>
            <div>Метро: {selectedProperty.metro_st}</div>
            <div>Цена: {selectedProperty.price}$</div>
            <div>Тип: {selectedProperty.action_type === 'rent' ? 'Аренда' : 'Продажа'}</div>
            <div>Комнаты: {selectedProperty.rooms}</div>
            <div>Этаж: {selectedProperty.floor} из {selectedProperty.floor_number}</div>
            <div>Площадь: {selectedProperty.area}</div>
            <div>Статус: {statusConfig[selectedProperty.status].label}</div>
            <div>Агент: {selectedProperty.agent}</div>
            <div>Контакт: {selectedProperty.contact}</div>
            <div>Дата создания: {selectedProperty.createdAt}</div>
          </div>
        </Card>
      )}
    </div>
  )
}

