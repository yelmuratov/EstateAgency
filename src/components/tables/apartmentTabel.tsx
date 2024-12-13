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
}

const statusConfig = {
  free: { label: 'Свободный', className: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100' },
  soon: { label: 'Скоро', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100' },
  busy: { label: 'Занят', className: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-100' },
};

export default function PropertyTable() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  const { apartments, fetchApartments } = useApartmentStore();

  // Fetch apartments on component mount
  useEffect(() => {
    fetchApartments(1, 10);
  }, [fetchApartments]);

  // Map fetched apartments to the properties structure
  useEffect(() => {
    if (apartments) {
      const mappedProperties = apartments.map((apartment: any) => ({
        id: apartment.id,
        title: apartment.title || 'Untitled',
        district: apartment.district || 'Unknown',
        price: apartment.price || 0,
        houseType: apartment.house_type || 'Unknown',
        createdAt: apartment.created_at || '',
        agent: apartment.responsible || 'Unknown',
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
              <th className="w-[50px] p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                <Checkbox />
              </th>
              <th className="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                ПРЕВЬЮ
              </th>
              <th className="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                НАЗВАНИЕ
              </th>
              <th className="hidden md:table-cell p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                ЦЕНА
              </th>
              <th className="hidden lg:table-cell p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                ТИП ДОМА
              </th>
              <th className="hidden lg:table-cell p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                ДАТА СОЗДАНИЯ
              </th>
              <th className="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                СТАТУС
              </th>
              <th className="hidden md:table-cell p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                ПЛОЩАДЬ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {properties.map((property) => (
              <tr
                key={property.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => toggleRow(property.id)}
              >
                <td className="p-2">
                  <Checkbox
                    checked={selectedRows.includes(property.id)}
                    onCheckedChange={() => toggleRow(property.id)}
                  />
                </td>
                <td className="p-2">
                 
                </td>
                <td className="p-2">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {property.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{property.district}</div>
                </td>
                <td className="hidden md:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                  ${property.price}
                </td>
                <td className="hidden lg:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                  {property.houseType}
                </td>
                <td className="hidden lg:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                  {property.createdAt}
                </td>
                <td className="p-2">
                  <Badge className={statusConfig[property.status]?.className || ''}>
                    {statusConfig[property.status]?.label || 'Unknown'}
                  </Badge>
                </td>
                <td className="hidden md:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                  {property.squareArea} m²
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
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {property.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {property.district}
                </div>
                <div className="text-sm text-gray-900 dark:text-gray-100">${property.price}</div>
                <Badge className={statusConfig[property.status]?.className || ''}>
                  {statusConfig[property.status]?.label || 'Unknown'}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
