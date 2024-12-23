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
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchMetros();
  }, [fetchMetros]);

  const handleDelete = async (metroId: number) => {
    try {
      await deleteMetro(metroId);
      toast({
        title: "Metro Station Deleted",
        description: "Metro station has been successfully deleted",
      });
    } catch{
      // Revert on error
      toast({
        title: "Error",
        description: "Failed to delete metro station",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div>
        {/* back button */}
        <div className="flex justify-between items-center mb-4">
          {/* back button */}
          <Button 
            onClick={() => router.push('/')}
          >
            Back
          </Button>
          <h2 className="text-2xl font-bold">Metro Stations</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Metro Station
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Metro Station</DialogTitle>
              </DialogHeader>
              <CreateMetroForm />
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metros.map((metro) => (
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
                          <DialogTitle>Edit Metro Station</DialogTitle>
                        </DialogHeader>
                        {selectedMetro && <EditMetroForm />}
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
                          <AlertDialogTitle>
                            Delete Metro Station
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this metro station?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(metro.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
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
