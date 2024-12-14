"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useApartmentStore } from "@/store/apartment/aparmentStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
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
  normal: "Обычное",
  repair: "Требует ремонта",
  euro: "Евроремонт",
};

export default function PropertyTable() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [itemsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { apartments, total, loading, error, fetchApartments } =
    useApartmentStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (fetchApartments) {
        fetchApartments(currentPage, itemsPerPage);
      }
    }, 300); // Debounced

    return () => clearTimeout(timer);
  }, [currentPage, itemsPerPage, fetchApartments]);

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

  if (loading) {
    return <h1>Loading......</h1>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
                Категория
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
            {Array.isArray(apartments) && apartments.length > 0 ? (
              apartments.map((apartment, index) => (
                <tr
                  key={apartment.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
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
                  <td className="p-2 text-sm text-gray-900 dark:text-gray-100">
                    {apartment.category}
                  </td>
                  <td className="hidden lg:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                    {houseTypeTranslation[apartment.category] ||
                      apartment.category}
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
                      onClick={() => {
                        window.location.href = `/edit-apartment/${apartment.id}`;
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
                <td
                  colSpan={10}
                  className="text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Нет доступных данных
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="block sm:hidden space-y-4">
        {apartments.map((apartment) => (
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
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    window.location.href = `/edit-apartment/${apartment.id}`;
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
        <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={closeModal} // Close modal when clicking on the backdrop
      >
        {/* Image Container */}
        <div
          className="relative"
          onClick={(e) => e.stopPropagation()} // Prevent modal closure when clicking on the image or button
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-80 focus:outline-none z-50"
          >
            <span className="text-2xl font-bold">✕</span>
          </button>
      
          {/* Image */}
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
}
