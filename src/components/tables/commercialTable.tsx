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
};

const CommercialTable: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  if (loading) {
    return <div>Loading...</div>;
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
            {commercials.map((commercial, index) => (
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
                  <div className="relative w-28 h-20 rounded-md overflow-hidden border border-gray-300 dark:border-gray-700">
                    {commercial.media && commercial.media[0] ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${commercial.media[0].url}`}
                        alt={commercial.title || "Preview image"}
                        layout="fill"
                        objectFit="cover"
                        className="bg-gray-200 dark:bg-gray-800"
                        onError={(e) => {
                          const imageElement = e.target as HTMLImageElement;
                          imageElement.style.display = "none";

                          const parentElement =
                            imageElement.parentNode as HTMLElement;
                          if (parentElement) {
                            parentElement.innerHTML = `
            <div class="flex items-center justify-center h-full w-full bg-red-100 text-red-500 text-sm font-medium">
              Ошибка изображения
            </div>
          `;
                          }
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
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {commercial.title}
                  </div>
                </td>
                <td className="hidden md:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                  ${commercial.price}
                </td>
                <td className="hidden lg:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                  {commercial.location}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View for Small Screens */}
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

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {currentPage > 1 && (
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
              />
            )}
          </PaginationItem>
          {[...Array(Math.ceil(total / itemsPerPage))].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {currentPage < Math.ceil(total / itemsPerPage) && (
            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CommercialTable;
