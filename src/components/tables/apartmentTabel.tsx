"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useApartmentStore } from "@/store/apartment/aparmentStore";
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
  second_responsible: string;
  second_agent_percent: number;
  second_agent_commission: number;
  action_type: string;
  location: string;
  created_at: string;
  crm_id: string;
  description: string;
  category: string;
  furnished: boolean;
  status_date: string;
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
  deal?: "true" | "false";
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
  repair: "Требует Требует ремонтаа",
  euro: "Евро ремонт",
  rent: "Аренда",
  sale: "Продажа",
  seperated: "Раздельный",
  combined: "Совмещенный",
  many: "Два и более",
};

interface PropertyTableProps {
  type: "rent" | "sale";
}


export default function PropertyTable({ type }: PropertyTableProps) {
  console.log("PropertyTable", type);
  const [itemsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    url: string;
    type: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(localStorage.getItem("currentPageApartment")) || 1;
  });
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem("searchQueryApartment") || "";
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [previewUrls] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  const { apartments, error, filterApartments } = useApartmentStore();
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    localStorage.setItem("currentPageApartment", String(currentPage));
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem("searchQueryApartment", searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (type === "rent") {
      filterApartments({ action_type: "rent" });
    } else {
      filterApartments({ action_type: "sale" });
    }

    const timer = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        useApartmentStore.getState().searchApartments(searchQuery);
      }
    }, 300); // Debounced

    return () => clearTimeout(timer);
  }, [searchQuery, type, filterApartments]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      if (type === "rent") {
        filterApartments({ action_type: "rent" });
      } else {
        filterApartments({ action_type: "sale" });
      }
    }
  }, [currentPage, itemsPerPage, type, filterApartments, searchQuery]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredApartments(apartments.slice(startIndex, endIndex));
  }, [apartments, currentPage, itemsPerPage]);

  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openModal = (media: Media) => {
    if (media.url) {
      const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${media.url}`;
      setModalContent({
        url: fullUrl,
        type: media.media_type, // 'video' or 'image'
      });
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalContent(null);
    setModalOpen(false);
  };

  const handleRowClick = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const renderPreviewCell = (media: Media[]) => {
    if (!media || media.length === 0) {
      return (
        <div className="flex items-center justify-center h-full w-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm font-medium">
          Нет медиа
        </div>
      );
    }

    const firstMedia = media[0];
    return (
      <div
        className="relative w-28 h-20 rounded-md overflow-hidden border border-gray-300 dark:border-gray-700 cursor-pointer"
        onClick={() => openModal(firstMedia)}
      >
        {firstMedia.media_type === "video" ? (
          <video
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${firstMedia.url}`}
            className="object-cover w-full h-full"
            muted
            playsInline
          />
        ) : (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${firstMedia.url}`}
            alt="Preview"
            layout="fill"
            objectFit="cover"
            className="bg-gray-200 dark:bg-gray-800"
          />
        )}
      </div>
    );
  };

  const renderMediaGallery = (media: Media[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {media.map((item) => (
          <div
            key={item.id}
            className="relative h-48 w-full border rounded-md overflow-hidden cursor-pointer"
            onClick={() => openModal(item)}
          >
            {item.media_type === "video" ? (
              <video
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.url}`}
                className="object-cover w-full h-full"
                muted
                playsInline
              />
            ) : (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.url}`}
                alt="Property media"
                layout="fill"
                objectFit="cover"
                className="bg-gray-200 dark:bg-gray-800"
              />
            )}
          </div>
        ))}
      </div>
    );
  };
  const renderModalContent = () => {
    if (!modalContent) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={closeModal}
      >
        <div
          className="relative max-w-4xl max-h-[90vh] p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-80 focus:outline-none z-50"
            aria-label="Close preview"
          >
            ✕
          </button>
          {modalContent.type === "video" ? (
            <video
              src={modalContent.url}
              className="max-w-full max-h-[80vh] rounded-lg"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <Image
              src={modalContent.url}
              alt="Preview"
              className="rounded-lg shadow-lg max-w-full max-h-[80vh] object-contain"
              width={1200}
              height={800}
            />
          )}
        </div>
      </div>
    );
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
              {/* crm id */}
              <th className="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                CRM ID
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
            ) : Array.isArray(filteredApartments) && filteredApartments.length > 0 ? (
              filteredApartments.map((apartment: Apartment, index: number) => (
                <React.Fragment key={apartment.id}>
                  <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleRowClick(apartment.id)}
                  >
                    <td className="w-[50px] p-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {apartment.crm_id}
                    </td>
                    <td className="p-2">
                      {renderPreviewCell(apartment.media)}
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
                      {/* status date */}
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {apartment.status_date && new Date(apartment.status_date).toLocaleDateString()}
                      </div>
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
                                {apartment.floor} из {apartment.floor_number}
                              </div>
                            </div>
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
                                Ответственный
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {apartment.responsible}
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
                                Второй агент
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {apartment.second_responsible}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Комиссия второго агента
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {apartment.second_agent_commission}$ ({apartment.second_agent_percent}%)
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
                                Контакты
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {apartment.name}, {apartment.phone_number}
                              </div>
                            </div>
                            {/* deal value with badge green or red */}
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Сделки
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {apartment.deal ? (
                                  <Badge className={apartment.deal === "true" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                    {apartment.deal === "true" ? "Да" : "Нет"}
                                  </Badge>
                                ) : (
                                  <Badge className={apartment.deal === "true" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                    Нет
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          {renderMediaGallery(apartment.media)}
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

      {modalOpen && renderModalContent()}

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

          {Array.from({ length: Math.ceil(apartments.length / itemsPerPage) })
            .map((_, i) => i + 1)
            .filter((page) => {
              return (
                page === 1 ||
                page === Math.ceil(apartments.length / itemsPerPage) ||
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
          {currentPage < Math.ceil(apartments.length / itemsPerPage) && (
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
