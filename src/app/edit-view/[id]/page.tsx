"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useViewStore } from "@/store/views/useViewStore";
import { EditViewForm } from "@/components/views/view-edit-form";
import { ViewFormData } from "@/store/views/useViewStore";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Spinner from "@/components/local-components/spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { format } from "date-fns";
import { Toaster } from "@/components/ui/toaster";

export default function EditViewPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { fetchViewById, updateView } = useViewStore();
  const [viewData, setViewData] = useState<ViewFormData | null>(null);

  useEffect(() => {
    const loadView = async () => {
      if (id) {
        try {
          const data = await fetchViewById(Number(id));
          if (data) {
            setViewData(data);
          }
        } catch (error) {
          toast({
            title: "Error",
            description: `Failed to load view data: ${error}`,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadView();
  }, [id, fetchViewById, toast]);

  const handleSubmit = async (data: ViewFormData) => {
    try {
      data.date = format(new Date(data.date), "yyyy-MM-dd");
      await updateView(Number(id), data);
      toast({
        title: "Просмотр обновлен",
        description: "Данные просмотра успешно обновлены",
        variant: "default",
      });
      router.push("/");
    } catch (error) {
      console.error("Error updating view:", error);
      const err = error as { detail?: { msg: string; ctx?: { expected: string } }[] } | { detail: string; status: number };
      if ('status' in err && err.status === 400 && typeof err.detail === 'string') {
        toast({
          title: "Ошибка при обновлении просмотра",
          description: err.detail,
          variant: "destructive",
        });
      } else if ('detail' in err && Array.isArray(err.detail) && err.detail.length > 0) {
        const errorMessage = err.detail[0].ctx?.expected || err.detail[0].msg;
        toast({
          title: "Ошибка при обновлении просмотра",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Ошибка при обновлении просмотра",
          description: "Произошла неизвестная ошибка",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <Spinner theme="dark" />;
  }

  if (!viewData) {
    return <div>View not found</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <EditViewForm viewId={Number(id)} initialData={viewData} onSubmit={handleSubmit} />
        <Button
          type="button"
          onClick={() => router.push("/")}
          className="w-full"
        >
          <ArrowLeft className="mr-3" />
          Назад
        </Button>
      </div>
      <Toaster />
    </DashboardLayout>
  );
}
