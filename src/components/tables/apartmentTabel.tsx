'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useApartmentStore } from '@/store/apartment/aparmentStore';

interface Property {
  id: number;
  title: string;
  district: string;
  price: number;
  houseType: string;
  createdAt: string;
  agent: string;
  status: 'free' | 'soon' | 'busy';
  squareArea: number;
  phoneNumber: string;
  metroSt: string;
  actionType: 'rent' | 'sale';
  rooms: number;
  floor: number;
  floorNumber: number;
  images: string[];
  media?: { url: string }[];
}

const statusConfig = {
  free: {
    label: 'Свободный',
    className: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100',
  },
  soon: {
    label: 'Скоро',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100',
  },
  busy: {
    label: 'Занят',
    className: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-100',
  },
};

const houseTypeTranslation: { [key: string]: string } = {
  new_building: 'Новостройка',
  secondary: 'Вторичка',
  apartment: 'Квартира',
  house: 'Дом',
  townhouse: 'Таунхаус',
};

export default function PropertyTable() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  const { apartments, fetchApartments } = useApartmentStore();

  useEffect(() => {
    fetchApartments(1, 10);
  }, [fetchApartments]);

  useEffect(() => {
    if (apartments) {
      const mappedProperties = apartments.map((apartment: any) => ({
        id: apartment.id,
        title: apartment.title || 'Без названия',
        district: apartment.district || 'Неизвестный',
        price: apartment.price || 0,
        houseType: apartment.house_type || 'unknown',
        createdAt: apartment.created_at || '',
        agent: apartment.responsible || 'Неизвестно',
        status: apartment.current_status || 'free',
        squareArea: apartment.square_area || 0,
        phoneNumber: apartment.phone_number || 'N/A',
        metroSt: apartment.metro_st || 'N/A',
        actionType: apartment.action_type || 'rent',
        rooms: apartment.rooms || 0,
        floor: apartment.floor || 0,
        floorNumber: apartment.floor_number || 0,
        images: apartment.media?.map((media: any) => media.url) || [],
      }));
      setProperties(mappedProperties);
    }
  }, [apartments]);

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
    setSelectedProperty(properties.find((property) => property.id === id) || null);
  };

  return (
    <div className="space-y-4">
      {/* Table View for Medium and Larger Screens */}
      <div className="hidden sm:block rounded-md border bg-white dark:bg-gray-800 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="w-[50px] p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">#</th>
              <th className="w-[50px] p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                <Checkbox />
              </th>
              <th className="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">ПРЕВЬЮ</th>
              <th className="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">НАЗВАНИЕ</th>
              <th className="hidden md:table-cell p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">ЦЕНА</th>
              <th className="hidden lg:table-cell p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">ТИП ДОМА</th>
              <th className="hidden lg:table-cell p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">ДАТА СОЗДАНИЯ</th>
              <th className="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">СТАТУС</th>
              <th className="hidden md:table-cell p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">ПЛОЩАДЬ</th>
              <th className="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">ДЕЙСТВИЯ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {properties.map((property, index) => (
              <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <td className="w-[50px] p-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100">{index + 1}</td>
                <td className="w-[50px] p-2 text-center">
                  <Checkbox
                    checked={selectedRows.includes(property.id)}
                    onCheckedChange={() => toggleRow(property.id)}
                  />
                </td>
                <td className="p-2">
                  <div className="relative w-28 h-20 rounded-md overflow-hidden border border-gray-300 dark:border-gray-700">
                    {property.media?.[0]?.url ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${property.media[0].url}`}
                        alt={property.title || 'Preview image'}
                        layout="fill"
                        objectFit="cover"
                        className="bg-gray-200 dark:bg-gray-800"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parentElement = (e.target as HTMLImageElement).parentNode as HTMLElement;
                          parentElement.innerHTML = `<div class="flex items-center justify-center h-full w-full bg-red-100 text-red-500 text-sm font-medium">
                          Ошибка изображения</div>`;
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm font-medium">
                        Нет изображения
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-2">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{property.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{property.district}</div>
                </td>
                <td className="hidden md:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">${property.price}</td>
                <td className="hidden lg:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                  {houseTypeTranslation[property.houseType] || property.houseType}
                </td>
                <td className="hidden lg:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                  {new Date(property.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2">
                  <Badge className={statusConfig[property.status]?.className || ''}>
                    {statusConfig[property.status]?.label || 'Неизвестно'}
                  </Badge>
                </td>
                <td className="hidden md:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                  {property.squareArea} м²
                </td>
                <td className="p-2">
                  <button
                    onClick={() => {
                      window.location.href = `/edit-property/${property.id}`;
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Редактировать
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View for Small Screens */}
      <div className="block sm:hidden space-y-4">
        {properties.map((property) => (
          <Card
            key={property.id}
            className="p-4 border dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <div className="flex items-center space-x-4">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{property.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{property.district}</div>
                <div className="text-sm text-gray-900 dark:text-gray-100">${property.price}</div>
                <Badge className={statusConfig[property.status]?.className || ''}>
                  {statusConfig[property.status]?.label || 'Неизвестно'}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
