"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCommercialStore } from "@/store/commercial/commercialStore";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
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
import { ImprovedImageSlider } from "@/components/ui/improved-image-slider";
import { useIsSuperUser } from "@/hooks/useIsSuperUser";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

interface Media {
  media_type: string;
  updated_at: string;
  apartment_id?: number;
  id: number;
  url: string;
  created_at: string;
}

const houseTypeTranslation: { [key: string]: string } = {
  new_building: "Новостройка",
  secondary: "Вторичка",
  apartment: "Квартира",
  house: "Дом",
  townhouse: "Таунхаус",
  normal: "Обычное",
  repair: "Требует Требует ремонтаа",
  euro: "Евро ремонт",
  business_center: "Бизнес-центр",
  administrative_building: "Административное здание",
  residential_building: "Жилое здание",
  cottage: "Коттедж",
  shopping_mall: "Торговый центр",
  industrial_zone: "Промышленная зона",
  market: "Рынок",
  detached_building: "Отдельно стоящее здание",
};

interface CommercialTableProps {
  type: "sale" | "rent";
}

const CommercialTable: React.FC<CommercialTableProps> = ({type}) => {
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(localStorage.getItem("currentPageCommercial")) || 1;
  });
  const [itemsPerPage] = useState(15);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sliderOpen, setSliderOpen] = useState(false);
  const [initialSlideIndex, setInitialSlideIndex] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const router = useRouter();
  const [isSuperUser, isSuperUserLoading] = useIsSuperUser();
  const { deleteCommercial } = useCommercialStore();
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("currentPageCommercial", String(currentPage));
  }, [currentPage]);

  const { commercials, error, filterCommercials } =
    useCommercialStore();

    useEffect(() => {
      const timer = setTimeout(() => {
        if (searchQuery.trim()) {
          useCommercialStore.getState().searchCommercial(searchQuery);
          setCurrentPage(1);
        } else {
          filterCommercials({}, type);
        }
      }, 300);
    
      return () => clearTimeout(timer);
    }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      filterCommercials({}, type);
    }
  }, [currentPage, itemsPerPage, type, filterCommercials, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openModal = (media: Media[], index: number) => {
    setInitialSlideIndex(index);
    setSliderOpen(true);
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
        onClick={() => openModal(media, 0)}
        title="Click to view in modal"
      >
        {firstMedia.media_type === 'video' ? (
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
  

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isSuperUserLoading) {
    return <Spinner theme="dark" />;
  }

  const paginatedCommercials = commercials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderModalContent = () => {
    const currentCommercial = paginatedCommercials.find(com => com.id === expandedRow);
    if (!currentCommercial) return null;

    return (
      <ImprovedImageSlider
        isOpen={sliderOpen}
        onClose={() => setSliderOpen(false)}
        media={currentCommercial.media || []}
        initialIndex={initialSlideIndex}
      />
    );
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteCommercial(deleteId);
      toast({
        title: "Коммерческая недвижимость удалена",
        description: "Коммерческая недвижимость успешно удалена",
      });
      setDeleteId(null);
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить коммерческую недвижимость",
        variant: "destructive",
      });
    }
  };

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
            ) : Array.isArray(paginatedCommercials) && paginatedCommercials.length > 0 ? (
              paginatedCommercials.map((commercial, index) => (
                <React.Fragment key={commercial.id}>
                  <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleRowClick(commercial.id)}
                  >
                    <td className="w-[50px] p-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-2">
                      {commercial.crm_id}
                    </td>
                    <td className="p-2">
                      {renderPreviewCell(commercial.media || [])}
                    </td>
                    <td className="p-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {commercial.title}
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {commercial.district}
                        </div>
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
                      {
                        commercial.status_date && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(commercial.status_date).toLocaleDateString()}
                          </div>
                        )
                      }
                    </td>
                    <td className="hidden md:table-cell p-2 text-sm text-gray-900 dark:text-gray-100">
                      {commercial.responsible}
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/edit-commercial/${commercial.id}`);
                          }}
                          variant="default"
                        >
                          Редактировать
                        </Button>
                        {isSuperUser && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteId(commercial.id);
                                }}
                                variant="destructive"
                              >
                                Удалить
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Удалить коммерческую недвижимость</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Вы уверены, что хотите удалить эту коммерческую недвижимость? Это действие нельзя отменить.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                  Удалить
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
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
                                Комнат
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {commercial.rooms}
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
                            <div>
                              <div className="font-medium text-gray-500 dark:text-gray-400">
                                Комиссия агента
                              </div>
                              <div className="text-gray-900 dark:text-gray-100">
                                {commercial.agent_commission}$ (
                                {commercial.agent_percent}%)
                              </div>
                            </div>
                            {/* second responsible and agent person */}
                            {commercial.second_responsible && (
                              <div>
                                <div>
                                  <div className="font-medium text-gray-500 dark:text-gray-400">
                                    Второй ответственный
                                  </div>
                                  <div className="text-gray-900 dark:text-gray-100">
                                    {commercial.second_responsible}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-500 dark:text-gray-400">
                                    Комиссия второго агента
                                  </div>
                                  <div className="text-gray-900 dark:text-gray-100">
                                    {commercial.agent_commission}$ (
                                    {commercial.second_agent_percent}%)
                                  </div>
                                </div>
                              </div>
                            )}
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
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                            {commercial.media &&
                              commercial.media.map((item, index) => (
                                <div
                                  key={item.id}
                                  className="relative h-48 w-full border rounded-md overflow-hidden cursor-pointer"
                                  onClick={() => openModal(commercial.media || [], index)}
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
        {paginatedCommercials.map((commercial) => (
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
      {sliderOpen && renderModalContent()}

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

          {Array.from({ length: Math.ceil(commercials.length / itemsPerPage) })
            .map((_, i) => i + 1)
            .filter((page) => {
              // Only show the first, last, and neighboring pages
              return (
                page === 1 ||
                page === Math.ceil(commercials.length / itemsPerPage) ||
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

          {currentPage < Math.ceil(commercials.length / itemsPerPage) && (
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
      
      {/* Filter Modal */}
      <CommercialFilter
        open={filterOpen}
        onOpenChange={() => setFilterOpen(false)}
        type={type}
      />
    </div>
  );
};

export default CommercialTable;

