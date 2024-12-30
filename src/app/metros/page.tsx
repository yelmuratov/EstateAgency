"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CreateMetroForm from "@/components/forms/create-metro-form";
import EditMetroForm from "@/components/forms/edit-metro-form";
import usePropertyStore from "@/store/MetroDistrict/propertyStore";
import { useRouter } from "next/navigation";
import { useIsSuperUser } from "@/hooks/useIsSuperUser";
import Spinner from "@/components/local-components/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import DashboardLayout from "@/components/layouts/DashboardLayout";

interface Metro {
  name: string;
  id: number;
  created_at: string;
  updated_at: string;
}


export default function MetrosTable() {
  const [selectedMetro, setSelectedMetro] = useState<Metro | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { fetchMetros, metros, deleteMetro } = usePropertyStore();
  const [isSuperUser, isSuperUserLoading] = useIsSuperUser();
  const router = useRouter();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [metrosPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchMetros();
  }, [fetchMetros]);

  useEffect(() => {
    if (!isSuperUserLoading && !isSuperUser) {
      router.push('/');
    }
  }, [isSuperUser, isSuperUserLoading, router]);

  useEffect(() => {
    setTotalPages(Math.ceil(metros.length / metrosPerPage));
  }, [metros, metrosPerPage]);

  const indexOfLastMetro = currentPage * metrosPerPage;
  const indexOfFirstMetro = indexOfLastMetro - metrosPerPage;
  const currentMetros = metros.slice(indexOfFirstMetro, indexOfLastMetro);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    router.push(`?page=${pageNumber}`);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const ellipsis = <PaginationItem key="ellipsis"><PaginationEllipsis /></PaginationItem>;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => paginate(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => paginate(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(ellipsis);
      }

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => paginate(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(ellipsis);
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => paginate(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (isSuperUserLoading) {
    return <Spinner theme="dark" />;
  }

  if (!isSuperUser) {
    return null;
  }

  const handleDelete = async (metroId: number) => {
    try {
      await deleteMetro(metroId);
      toast({
        title: "Станция метро удалена",
        description: "Станция метро успешно удалена",
      });
    } catch {
      // Revert on error
      toast({
        title: "Ошибка",
        description: "Не удалось удалить станцию метро",
        variant: "destructive",
      });
    }
  };

  return (
<DashboardLayout>
<div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <Button onClick={() => router.push("/")}>Назад</Button>
          <h2 className="text-2xl font-bold">Станции метро</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Добавить станцию метро
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Создать новую станцию метро</DialogTitle>
              </DialogHeader>
              <CreateMetroForm setIsCreateOpen={setIsCreateOpen} onMetroCreated={fetchMetros} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentMetros.map((metro) => (
                <TableRow key={metro.id}>
                  <TableCell>{metro.name}</TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      open={isEditOpen && selectedMetro?.id === metro.id}
                      onOpenChange={(open) => {
                        setIsEditOpen(open);
                        if (!open) setSelectedMetro(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedMetro(metro)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Редактировать станцию метро</DialogTitle>
                        </DialogHeader>
                        {selectedMetro && (
                          <EditMetroForm metro={{ ...selectedMetro, id: selectedMetro.id.toString() }} setIsEditOpen={setIsEditOpen} />
                        )}
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Удалить станцию метро</AlertDialogTitle>
                          <AlertDialogDescription>
                            Вы уверены, что хотите удалить эту станцию метро? Это действие нельзя отменить.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(metro.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  {currentPage > 1 && (
                    <PaginationPrevious 
                      onClick={() => paginate(currentPage - 1)}
                    />
                  )}
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  {currentPage < totalPages && (
                    <PaginationNext 
                      onClick={() => paginate(currentPage + 1)}
                    />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
</DashboardLayout>
  );
}
