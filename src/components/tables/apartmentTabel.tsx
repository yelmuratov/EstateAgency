"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useApartmentStore } from "@/store/apartment/aparmentStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PropertyFilter } from "@/components/property-filter";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface Media {
  media_type: string;
  updated_at: string;
  apartment_id: number;
  id: number;
  url: string;
  created_at: string;
}

interface Apartment {
  id: number;
  title: string;
  rooms: number;
  square_area: number;
  agent_percent: number;
  agent_commission: number;
  action_type: string;
  location: string;
  created_at: string;
  crm_id: string;
  description: string;
  category: string;
  furnished: boolean;
  updated_at: string;
  comment: string;
  house_condition: string;
  house_type: string;
  price: number;
  current_status: string;
  district: string;
  responsible: string;
  floor_number: number;
  floor: number;
  name: string;
  phone_number: string;
  bathroom: string;
  media: Media[];
  metro_st: string;
}

const statusConfig = {
  free: {
    label: "Свободный",
    className:
      "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100",
  },
  soon: {
    label: "Скоро",
    className:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100",
  },
  busy: {
    label: "Занят",
    className:
      "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-100",
  },
};

const houseTypeTranslation: { [key: string]: string } = {
  new_building: "Новостройка",
  secondary: "Вторичка",
  apartment: "Квартира",
  house: "Дом",
  townhouse: "Таунхаус",
  normal: "Обычное",
  repair: "Требует ремонта",
  euro: "Евроремонт",
  rent: "Аренда",
  sale: "Продажа",
  seperated: "Раздельный",
  combined: "Совмещенный",
  many: "Несколько",
};

export default function PropertyTable() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [itemsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const router = useRouter();

  const { apartments, total, error, fetchApartments } = useApartmentStore();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        useApartmentStore.getState().searchApartments(searchQuery);
      } else if (fetchApartments) {
        fetchApartments(currentPage, itemsPerPage);
      }
    }, 300); // Debounced

    return () => clearTimeout(timer);
  }, [searchQuery, currentPage, itemsPerPage, fetchApartments]);

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openModal = (imageUrl: string) => {
    if (imageUrl) {
      setModalImage(imageUrl);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalImage(null);
    setModalOpen(false);
  };

  const handleRowClick = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (error) {
    return (
      <div className="text-center text-red-500 dark:text-red-400">{error}</div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table View for Medium and Larger Screens */}
      <div className="flex items-center justify-between">
        <div className="relative flex-grow sm:max-w-md w-full">
          <Input
            type="text"
            placeholder="Поиск"
            className="pl-10 pr-4 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
        <Button
          variant="default"
          className="ml-2 hidden sm:flex"
          onClick={() => setFilterOpen(true)}
        >
          <Filter className="mr-2 h-4 w-4" /> Фильтр
        </Button>
      </div>
      <div className="hidden sm:block rounded-md border bg-white dark:bg-gray-800 overflow-x-auto">
        {/* search input with shadcn */}
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="w-[50px] p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                #
              </th>
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
              <th className="hidden md:table-cell p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                Тип действия
              </th>
              <th className="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                Тип Недвижимости
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
              <th className="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                ДЕЙСТВИЯ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {error ? (
              <tr>
                <td
                  colSpan={11}
                  className="text-center py-4 text-red-500 dark:text-red-400"
                >
                  Произошла ошибка: {error}
                </td>
              </tr>
            ) : Array.isArray(apartments) && apartments.length > 0 ? (
              apartments.map((apartment: Apartment, index: number) => (
                <React.Fragment key={apartment.id}>
                  <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleRowClick(apartment.id)}
                  >
                    <td className="w-[50px] p-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="w-[50px] p-2 text-center">
                      <Checkbox
                        checked={selectedRows.includes(apartment.id)}
                        onCheckedChange={() => toggleRow(apartment.id)}
                      />
                    </td>
                    <td className="p-2">
                      <div
                        className="relative w-28 h-20 rounded-md overflow-hidden border border-gray-300 dark:border-gray-700"
                        onClick={() =>
                          openModal(
                            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${apartment.media[0]?.url}`
                          )
                        }
                      >
                        {apartment.media && apartment.media[0] ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${apartment.media[0].url}`}
                            alt={apartment.title || "Preview image"}
                            layout="fill"
                            objectFit="cover"
                            className="bg-gray-200 dark:bg-gray-800"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm font-medium">
                            Нет изображения
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {apartment.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {apartment.district}
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                      ${apartment.price}
                    </td>
                    <td className="hidden md:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                      {houseTypeTranslation[apartment.action_type] ||
                        apartment.action_type}
                    </td>
                    <td className="hidden lg:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                      {houseTypeTranslation[apartment.house_type] ||
                        apartment.house_type}
                      <br />
                      {houseTypeTranslation[apartment.house_condition] ||
                        apartment.house_condition}
                    </td>
                    <td className="hidden lg:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                      {new Date(apartment.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <Badge
                        className={
                          statusConfig[
                            apartment.current_status as keyof typeof statusConfig
                          ]?.className || ""
                        }
                      >
                        {statusConfig[
                          apartment.current_status as keyof typeof statusConfig
                        ]?.label || "Неизвестно"}
                      </Badge>
                    </td>
                    <td className="hidden md:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                      {apartment.square_area} м²
                    </td>
                    <td className="p-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/edit-apartment/${apartment.id}`);
                        }}
                        variant="default"
                      >
                        Редактировать
                      </Button>
                    </td>
                  </tr>
                  {expandedRow === apartment.id && (
                    <tr className="bg-gray-50 dark:bg-gray-600">
                      <td colSpan={11}>
                        <div className="p-4 space-y-4 text-sm">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Комнаты
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {apartment.rooms}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Этаж
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {apartment.floor_number} из {apartment.floor}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Ванная
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {houseTypeTranslation[apartment.bathroom]}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Метро
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {apartment.metro_st}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Комиссия агента
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {apartment.agent_commission}$ (
                                {apartment.agent_percent}%)
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                CRM ID
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {apartment.crm_id}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Мебель
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {apartment.furnished ? "Да" : "Нет"}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Описание
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {apartment.description ||
                                  "Описание отсутствует"}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Комментарий
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {apartment.comment || "Комментарий отсутствует"}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Ответственный
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {apartment.responsible}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Контакты
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {apartment.name}, {apartment.phone_number}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                            {apartment.media.map((image) => (
                              <div
                                key={image.id}
                                className="relative h-48 w-full border rounded-md overflow-hidden cursor-pointer"
                                onClick={() =>
                                  openModal(
                                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/${image.url}`
                                  )
                                }
                              >
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${image.url}`}
                                  alt="Apartment Image"
                                  layout="fill"
                                  objectFit="cover"
                                  className="bg-gray-200 dark:bg-gray-800"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan={11}
                  className="text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Нет доступных данных
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden space-y-4">
        {apartments.map((apartment: Apartment) => (
          <Card
            key={apartment.id}
            className="p-4 border dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <div className="flex flex-col space-y-2">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {apartment.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {apartment.district}
                </div>
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  ${apartment.price}
                </div>
                <Badge
                  className={
                    statusConfig[
                      apartment.current_status as keyof typeof statusConfig
                    ]?.className || ""
                  }
                >
                  {statusConfig[
                    apartment.current_status as keyof typeof statusConfig
                  ]?.label || "Неизвестно"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => {
                    router.push(`/edit-apartment/${apartment.id}`);
                  }}
                  variant="default"
                >
                  Редактировать
                </Button>
                <Button
                  onClick={() => handleRowClick(apartment.id)}
                  variant="ghost"
                  className="p-2"
                >
                  {expandedRow === apartment.id ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </Button>
              </div>
            </div>
            {expandedRow === apartment.id && (
              <div className="mt-4 pt-4 border-t dark:border-gray-700 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-gray-500 dark:text-gray-400">
                      Комнаты
                    </div>
                    <div className="text-gray-900 dark:text-gray-100">
                      {apartment.rooms}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500 dark:text-gray-400">
                      Площадь
                    </div>
                    <div className="text-gray-900 dark:text-gray-100">
                      {apartment.square_area} м²
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500 dark:text-gray-400">
                      Этаж
                    </div>
                    <div className="text-gray-900 dark:text-gray-100">
                      {apartment.floor_number} из {apartment.floor}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500 dark:text-gray-400">
                      Ванная
                    </div>
                    <div className="text-gray-900 dark:text-gray-100">
                      {houseTypeTranslation[apartment.bathroom] ||
                        apartment.bathroom}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-500 dark:text-gray-400">
                    Описание
                  </div>
                  <div className="text-gray-900 dark:text-gray-100">
                    {apartment.description || "Описание отсутствует"}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-500 dark:text-gray-400">
                    Контакты
                  </div>
                  <div className="text-gray-900 dark:text-gray-100">
                    {apartment.name}, {apartment.phone_number}
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Modal for Image Preview */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative max-w-3xl max-h-screen p-4"
            onClick={(e) => e.stopPropagation()} // Prevents closing modal on inner click
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-80 focus:outline-none z-50"
              aria-label="Close"
            >
              ✕
            </button>
            {modalImage && (
              <Image
                src={modalImage}
                alt="Preview"
                className="rounded-lg shadow-lg max-w-full max-h-screen"
                width={900}
                height={600}
                objectFit="contain"
              />
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>
          )}

          {Array.from({ length: Math.ceil(total / itemsPerPage) })
            .map((_, i) => i + 1)
            .filter((page) => {
              return (
                page === 1 ||
                page === Math.ceil(total / itemsPerPage) ||
                Math.abs(page - currentPage) <= 2
              );
            })
            .map((page, index, pages) => (
              <React.Fragment key={page}>
                {index > 0 && page > pages[index - 1] + 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              </React.Fragment>
            ))}
          {currentPage < Math.ceil(total / itemsPerPage) && (
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>

      <PropertyFilter open={filterOpen} onOpenChange={setFilterOpen} />
    </div>
  );
}
