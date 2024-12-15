"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCommercialStore } from "@/store/commercial/commercialStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Spinner from "../local-components/spinner";

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

const CommercialTable: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(localStorage.getItem("currentPageCommercial")) || 1; // Retrieve from localStorage or default to 1
  });  
  const [itemsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("currentPageCommercial", String(currentPage)); // Save currentPage to localStorage
  }, [currentPage]);  

  const { commercials, total, loading, error, fetchCommercials } =
    useCommercialStore();

  useEffect(() => {
    fetchCommercials(currentPage, itemsPerPage);
  }, [fetchCommercials, currentPage, itemsPerPage]);

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

  if (loading) {
    return <Spinner theme="dark" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (commercials.length === 0) {
    return <div>No commercial properties available.</div>;
  }

  return (
    <div className="space-y-4">
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
            {Array.isArray(commercials) && commercials.length > 0 ? (
              commercials.map((commercial, index) => (
                <tr
                  key={commercial.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <td className="w-[50px] p-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="w-[50px] p-2 text-center">
                    <Checkbox
                      checked={selectedRows.includes(commercial.id)}
                      onCheckedChange={() => toggleRow(commercial.id)}
                    />
                  </td>
                  <td className="p-2">
                    <div
                      className="relative w-28 h-20 rounded-md overflow-hidden border border-gray-300 dark:border-gray-700"
                      onClick={() =>
                        openModal(
                          `${process.env.NEXT_PUBLIC_API_BASE_URL}/${commercial.media[0]?.url}`
                        )
                      }
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
                    {houseTypeTranslation[commercial.house_condition] ||
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
                      onClick={() => {
                        window.location.href = `/edit-property/${commercial.id}`;
                      }}
                      variant="default"
                    >
                      Редактировать
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center p-4 text-gray-500">
                  No commercial properties available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
                  {commercial.location}
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
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    window.location.href = `/edit-property/${commercial.id}`;
                  }}
                  variant="default"
                >
                  Редактировать
                </Button>
              </div>
            </div>
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
            {modalImage && (
              <Image
                src={modalImage}
                alt="Preview"
                width={600}
                height={400}
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
    </div>
  );
};

export default CommercialTable;
