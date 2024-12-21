"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLandStore } from "@/store/land/landStore";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LandFilter } from "../land-filter";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import Spinner from "../local-components/spinner";

interface Media {
  id: number;
  url: string;
  media_type: string;
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

const landConditionTranslation: { [key: string]: string } = {
  new: "Новый",
  good: "Хороший",
  needs_repair: "Требует ремонта",
  old: "Старый",
  euro: "Евро",
  normal: "Обычное",
  repair: "Ремонт",
};

const locationOptions = [
  { value: "city", label: "Город" },
  { value: "suburb", label: "Пригород" },
  { value: "countryside", label: "Сельская местность" },
  { value: "along_road", label: "Вдоль дороги" },
  { value: "near_pond", label: "У водоема" },
  { value: "foothills", label: "Предгорье" },
  { value: "cottage_area", label: "Дачный массив" },
  { value: "closed_area", label: "Закрытая территория" },
];

const LandTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(localStorage.getItem("currentPageLand")) || 1;
  });
  const [itemsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    url: string;
    type: string;
  } | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const router = useRouter();
  const { lands, total, loading, error, fetchLands } = useLandStore();

  useEffect(() => {
    localStorage.setItem("currentPageLand", String(currentPage));
  }, [currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        useLandStore.getState().searchLands(searchQuery);
      } else {
        fetchLands(currentPage, itemsPerPage);
      }
    }, 300); // 300ms debounce to optimize input handling

    return () => clearTimeout(timer); // Clear the timer on cleanup
  }, [searchQuery, currentPage, itemsPerPage, fetchLands]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openModal = (media: Media) => {
    try {
      const validUrl = new URL(
        media.url,
        process.env.NEXT_PUBLIC_API_BASE_URL
      ).toString();
      setModalContent({
        url: validUrl,
        type: media.media_type,
      });
      setModalOpen(true);
    } catch (error) {
      console.error("Invalid URL:", error);
    }
  };

  const closeModal = () => {
    setModalContent(null);
    setModalOpen(false);
  };

  const handleRowClick = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const renderMediaGallery = (media: Media[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {media &&
          media.map((item) => (
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
                  alt="Media preview"
                  layout="fill"
                  objectFit="cover"
                />
              )}
            </div>
          ))}
      </div>
    );
  };

  if (loading) {
    return <Spinner theme="dark" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
            value={searchQuery} // Bind searchQuery to input
            onChange={(e) => setSearchQuery(e.target.value)} // Update state on change
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
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="w-[50px] p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                #
              </th>
              <th className="w-[50px] p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
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
            ) : lands.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Нет доступных данных
                </td>
              </tr>
            ) : (
              lands.map((land, index) => (
                <React.Fragment key={land.id}>
                  <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleRowClick(land.id)}
                  >
                    <td className="w-[50px] p-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="w-[50px] p-2 text-center">{land.crm_id}</td>
                    <td className="p-2">
                      <div
                        className="relative w-28 h-20 rounded-md overflow-hidden border border-gray-300 dark:border-gray-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (land.media && land.media[0]) {
                            openModal(land.media[0]);
                          }
                        }}
                      >
                        {land.media && land.media[0] ? (
                          land.media[0].media_type === "video" ? (
                            <video
                              src={new URL(
                                land.media[0].url,
                                process.env.NEXT_PUBLIC_API_BASE_URL
                              ).toString()}
                              className="object-cover w-full h-full"
                              muted
                              playsInline
                            />
                          ) : (
                            <Image
                              src={new URL(
                                land.media[0].url,
                                process.env.NEXT_PUBLIC_API_BASE_URL
                              ).toString()}
                              alt={land.title || "Preview image"}
                              layout="fill"
                              objectFit="cover"
                              className="bg-gray-200 dark:bg-gray-800"
                            />
                          )
                        ) : (
                          <div className="flex items-center justify-center h-full w-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm font-medium">
                            Нет медиа
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {land.title}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {land.district}
                        </p>
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                      ${land.price}
                    </td>
                    <td className="p-2 text-sm text-gray-900 dark:text-gray-100">
                      {land.action_type === "rent" ? "Аренда" : "Продажа"}
                    </td>
                    <td className="text-sm text-gray-500 dark:text-gray-400">
                      {locationOptions.find(
                        (option) => option.value === land.location
                      )?.label || land.location}
                    </td>
                    <td className="hidden lg:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                      {landConditionTranslation[land.house_condition] ||
                        land.house_condition}
                    </td>
                    <td className="p-2">
                      <Badge
                        className={
                          statusConfig[
                            land.current_status as keyof typeof statusConfig
                          ]?.className || ""
                        }
                      >
                        {statusConfig[
                          land.current_status as keyof typeof statusConfig
                        ]?.label || "Неизвестно"}
                      </Badge>
                      {/* status date */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {land.status_date &&
                          new Date(land.status_date).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="hidden md:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                      {land.responsible}
                    </td>
                    <td className="p-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/edit-land/${land.id}`);
                        }}
                        variant="default"
                      >
                        Редактировать
                      </Button>
                    </td>
                  </tr>
                  {expandedRow === land.id && (
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td colSpan={11}>
                        <div className="p-4 space-y-4 text-sm">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Площадь
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {land.square_area} м²
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Ответственный
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {land.responsible}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Комиссия агента
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {land.agent_commission}$ ({land.agent_percent}%)
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Второй ответственный
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {land.second_responsible}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Комиссия второго агента
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {land.agent_commission}$ ({land.second_agent_percent}%)
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Парковка
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {land.parking_place ? "Да" : "Нет"}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Описание
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {land.description || "Описание отсутствует"}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Комментарий
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {land.comment || "Комментарий отсутствует"}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                            {land.media &&
                              land.media.map((image: Media) => (
                                <div
                                  key={image.id}
                                  className="relative h-48 w-full border rounded-md overflow-hidden cursor-pointer"
                                  onClick={() => openModal(image)}
                                >
                                  {image.media_type === "video" ? (
                                    <video
                                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${image.url}`}
                                      className="object-cover w-full h-full"
                                      muted
                                      playsInline
                                    />
                                  ) : (
                                    <Image
                                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${image.url}`}
                                      alt="Land Image"
                                      layout="fill"
                                      objectFit="cover"
                                      className="bg-gray-200 dark:bg-gray-800"
                                    />
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden space-y-4">
        {lands.map((land) => (
          <Card
            key={land.id}
            className="p-4 border dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <div className="flex flex-col space-y-2">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {land.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {locationOptions.find(
                    (option) => option.value === land.location
                  )?.label || land.location}
                </div>
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  ${land.price}
                </div>
                <Badge
                  className={
                    statusConfig[
                      land.current_status as keyof typeof statusConfig
                    ]?.className || ""
                  }
                >
                  {statusConfig[
                    land.current_status as keyof typeof statusConfig
                  ]?.label || "Неизвестно"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => router.push(`/edit-land/${land.id}`)}
                  variant="default"
                >
                  Редактировать
                </Button>
                <Button
                  onClick={() => handleRowClick(land.id)}
                  variant="ghost"
                  className="p-2"
                >
                  {expandedRow === land.id ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
            </div>
            {expandedRow === land.id && (
              <div className="mt-4 pt-4 border-t dark:border-gray-700 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-gray-500 dark:text-gray-400">
                      Площадь
                    </div>
                    <div className="text-gray-900 dark:text-gray-100">
                      {land.square_area} м²
                    </div>
                    <div className="font-medium text-gray-500 dark:text-gray-400">
                      Второй ответственный
                    </div>
                    <div className="text-gray-900 dark:text-gray-100">
                      {land.second_responsible}
                    </div>
                    <div className="font-medium text-gray-500 dark:text-gray-400">
                      Комиссия агента
                    </div>
                    <div className="text-gray-900 dark:text-gray-100">
                      {land.agent_commission}$ ({land.agent_percent}%)
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500 dark:text-gray-400">
                      Парковка
                    </div>
                    <div className="text-gray-900 dark:text-gray-100">
                      {land.parking_place ? "Да" : "Нет"}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-500 dark:text-gray-400">
                    Описание
                  </div>
                  <div className="text-gray-900 dark:text-gray-100">
                    {land.description || "Описание отсутствует"}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-500 dark:text-gray-400">
                    Комментарий
                  </div>
                  <div className="text-gray-900 dark:text-gray-100">
                    {land.comment || "Комментарий отсутствует"}
                  </div>
                </div>
                {land.media &&
                  land.media.length > 0 &&
                  renderMediaGallery(land.media)}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Modal for Image Preview */}
      {modalOpen && modalContent && (
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
      <LandFilter open={filterOpen} onOpenChange={setFilterOpen} />
    </div>
  );
};

export default LandTable;
