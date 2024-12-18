"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCommercialStore } from "@/store/commercial/commercialStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Spinner from "@/components/local-components/spinner";
import { CommercialFilter } from "../commercial-filter";

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
  business_center: "Бизнес-центр",
  administrative_building: "Административное здание",
  residential_building: "Жилое здание",
  cottage: "Коттедж",
  shopping_mall: "Торговый центр",
  industrial_zone: "Промышленная зона",
  market: "Рынок",
  detached_building: "Отдельно стоящее здание",
};

const CommercialTable: React.FC = ({}) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(localStorage.getItem("currentPageCommercial")) || 1;
  });
  const [itemsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("currentPageCommercial", String(currentPage));
  }, [currentPage]);

  const { commercials, total, loading, error, fetchCommercials } =
    useCommercialStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        useCommercialStore.getState().searchCommercial(searchQuery);
      } else if (fetchCommercials) {
        fetchCommercials(currentPage, itemsPerPage);
      }
    }, 300); // Debounced input

    return () => clearTimeout(timer);
  }, [searchQuery, fetchCommercials, currentPage, itemsPerPage]);

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalImage(null);
    setModalOpen(false);
  };

  const handleRowClick = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (loading) {
    return <Spinner theme="dark" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-grow sm:max-w-md w-full">
          <Input
            type="text"
            placeholder="Поиск"
            className="pl-10 pr-4 py-2 w-full"
            value={searchQuery} // Bind searchQuery to input
            onChange={(e) => setSearchQuery(e.target.value)} // Update state on change
          />

          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
        <Button variant="default" className="ml-2 hidden sm:flex"  onClick={() => setFilterOpen(true)}>
          <Filter className="mr-2 h-4 w-4" /> Фильтр
        </Button>
      </div>
      {/* Table View for Medium and Larger Screens */}
      <div className="hidden sm:block rounded-md border bg-white dark:bg-gray-800 overflow-x-auto">
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
              <th className="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                Тип действия
              </th>
              <th className="hidden lg:table-cell p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                ЛОКАЦИЯ
              </th>
              <th className="hidden lg:table-cell p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                СОСТОЯНИЕ
              </th>
              <th className="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                СТАТУС
              </th>
              <th className="hidden md:table-cell p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                ОТВЕТСТВЕННЫЙ
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
            ) : Array.isArray(commercials) && commercials.length > 0 ? (
              commercials.map((commercial, index) => (
                <React.Fragment key={commercial.id}>
                  <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleRowClick(commercial.id)}
                  >
                    <td className="w-[50px] p-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="w-[50px] p-2 text-center">
                      <Checkbox
                        checked={selectedRows.includes(commercial.id)}
                        onCheckedChange={() => toggleRow(commercial.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="p-2">
                      <div
                        className="relative w-28 h-20 rounded-md overflow-hidden border border-gray-300 dark:border-gray-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(
                            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${commercial.media?.[0]?.url}`
                          );
                        }}
                      >
                        {commercial.media && commercial.media[0] ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${commercial.media[0].url}`}
                            alt={commercial.title || "Preview image"}
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
                        {commercial.title}
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                      ${commercial.price}
                    </td>
                    <td className="p-2 text-sm text-gray-900 dark:text-gray-100">
                      {commercial.action_type === "rent" ? "Аренда" : "Продажа"}
                    </td>
                    <td className="hidden lg:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                      {houseTypeTranslation[commercial.location] ||
                        commercial.location}
                    </td>
                    <td className="hidden lg:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                      {(commercial.house_condition &&
                        houseTypeTranslation[commercial.house_condition]) ||
                        commercial.house_condition}
                    </td>
                    <td className="p-2">
                      <Badge
                        className={
                          statusConfig[
                            commercial.current_status as keyof typeof statusConfig
                          ]?.className || ""
                        }
                      >
                        {statusConfig[
                          commercial.current_status as keyof typeof statusConfig
                        ]?.label || "Неизвестно"}
                      </Badge>
                    </td>
                    <td className="hidden md:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                      {commercial.responsible}
                    </td>
                    <td className="p-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/edit-commercial/${commercial.id}`);
                        }}
                        variant="default"
                      >
                        Редактировать
                      </Button>
                    </td>
                  </tr>
                  {expandedRow === commercial.id && (
                    <tr className="bg-gray-50 dark:bg-gray-600">
                      <td colSpan={11}>
                        <div className="p-4 space-y-4 text-sm">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Площадь
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {commercial.square_area} м²
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Парковка
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {commercial.parking_place ? "Да" : "Нет"}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                CRM ID
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {commercial.crm_id || "Не указан"}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Комиссия агента
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {commercial.agent_commission}$ (
                                {commercial.agent_percent}%)
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Описание
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {commercial.description ||
                                  "Описание отсутствует"}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Комментарий
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {commercial.comment ||
                                  "Комментарий отсутствует"}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Ответственный
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {commercial.responsible ||
                                  "Ответственный не указан"}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {commercial.media &&
                              commercial.media.map((image) => (
                                <div
                                  key={image.id}
                                  className="relative h-32 w-full border rounded-md overflow-hidden cursor-pointer"
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
        {commercials.map((commercial) => (
          <Card
            key={commercial.id}
            className="p-4 border dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <div className="flex flex-col space-y-2">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {commercial.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {houseTypeTranslation[commercial.location] ||
                    commercial.location}
                </div>
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  ${commercial.price}
                </div>
                <Badge
                  className={
                    statusConfig[
                      commercial.current_status as keyof typeof statusConfig
                    ]?.className || ""
                  }
                >
                  {statusConfig[
                    commercial.current_status as keyof typeof statusConfig
                  ]?.label || "Неизвестно"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <Button
                  onClick={() =>
                    router.push(`/edit-commercial/${commercial.id}`)
                  }
                  variant="default"
                >
                  Редактировать
                </Button>
                <Button
                  onClick={() => handleRowClick(commercial.id)}
                  variant="ghost"
                  className="p-2"
                >
                  {expandedRow === commercial.id ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </Button>
              </div>
            </div>
            {expandedRow === commercial.id && (
              <div className="mt-4 pt-4 border-t dark:border-gray-700 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-gray-500 dark:text-gray-400">
                      Площадь
                    </div>
                    <div className="text-gray-900 dark:text-gray-100">
                      {commercial.square_area} м²
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500 dark:text-gray-400">
                      Парковка
                    </div>
                    <div className="text-gray-900 dark:text-gray-100">
                      {commercial.parking_place ? "Да" : "Нет"}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-500 dark:text-gray-400">
                    Описание
                  </div>
                  <div className="text-gray-900 dark:text-gray-100">
                    {commercial.description || "Описание отсутствует"}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-500 dark:text-gray-400">
                    Комментарий
                  </div>
                  <div className="text-gray-900 dark:text-gray-100">
                    {commercial.comment || "Комментарий отсутствует"}
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Modal for Image Preview */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-lg w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            {modalOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={closeModal}
              >
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-white bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-80 focus:outline-none z-50"
                  >
                    <span className="text-2xl font-bold">✕</span>
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
              // Only show the first, last, and neighboring pages
              return (
                page === 1 ||
                page === Math.ceil(total / itemsPerPage) ||
                Math.abs(page - currentPage) <= 2
              );
            })
            .map((page, index, pages) => (
              <React.Fragment key={page}>
                {/* Add ellipsis if there are skipped pages */}
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
      <CommercialFilter 
        open={filterOpen} 
        onOpenChange={() => setFilterOpen(false)} 
        onApplyFilters={(filters) => {
          // Handle filter application logic here
          console.log(filters);
        }} 
      />
    </div>
  );
};

export default CommercialTable;
