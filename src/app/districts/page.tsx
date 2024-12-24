"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import usePropertyStore from "@/store/MetroDistrict/propertyStore";
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
import CreateDistrictForm from "@/components/forms/create-district-form";
import EditDistrictForm from "@/components/forms/edit-district-form";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useIsSuperUser } from "@/hooks/useIsSuperUser";
import Spinner from "@/components/local-components/spinner";

interface District {
  id: number;
  name: string;
}

export default function DistrictsTable() {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { districts, fetchDistricts, deleteDistrict } = usePropertyStore();
  const [isSuperUser, isSuperUserLoading] = useIsSuperUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isSuperUserLoading && !isSuperUser) {
      router.push("/");
    }
  }, [isSuperUser, isSuperUserLoading, router]);

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  if (isSuperUserLoading) {
    return <Spinner theme="dark" />;
  }

  if (!isSuperUser) {
    return null;
  }

  const handleDelete = async (districtId: number) => {
    try {
      await deleteDistrict(districtId);
      toast({
        title: "Успех",
        description: "Район успешно удален",
      });
      router.refresh();
    } catch {
      // Revert on error
      toast({
        title: "Ошибка",
        description: "Не удалось удалить район",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-4">
          <Button onClick={() => router.push("/")}>Назад</Button>
          <h2 className="text-2xl font-bold">Районы</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Добавить район
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Создать новый район</DialogTitle>
              </DialogHeader>
              <CreateDistrictForm />
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
              {districts.map((district) => (
                <TableRow key={district.id}>
                  <TableCell>{district.name}</TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      open={isEditOpen && selectedDistrict?.id === district.id}
                      onOpenChange={(open) => {
                        setIsEditOpen(open);
                        if (!open) setSelectedDistrict(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedDistrict(district)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Редактировать район</DialogTitle>
                        </DialogHeader>
                        {selectedDistrict && <EditDistrictForm />}
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
                          <AlertDialogTitle>Удалить район</AlertDialogTitle>
                          <AlertDialogDescription>
                            Вы уверены, что хотите удалить этот район? Это
                            действие нельзя отменить.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(district.id)}
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
        </div>
      </div>
    </DashboardLayout>
  );
}
