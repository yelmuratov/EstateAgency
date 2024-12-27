"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useClientStore } from "@/store/clients/useClientStore";
import { EditClientForm } from "@/components/clients/client-edit-form";
import { PropertyFormData } from "@/types/property";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Spinner from "@/components/local-components/spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function EditClientPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { fetchClientById } = useClientStore();
  const [clientData, setClientData] = useState<PropertyFormData | null>(null);

  useEffect(() => {
    const loadClient = async () => {
      if (id) {
        try {
          const data = await fetchClientById(Number(id));
          if (data) {
            setClientData(data);
          }
        } catch (error) {
          toast({
            title: "Error",
            description: `Failed to load client data: ${error}`,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadClient();
  }, [id, fetchClientById, toast]);

  if (loading) {
    return <Spinner theme="dark" />;
  }

  if (!clientData) {
    return <div>Client not found</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <EditClientForm clientId={Number(id)} initialData={clientData} />
        <Button
          type="button"
          onClick={() => router.push("/")}
          className="w-full"
        >
          <ArrowLeft className="mr-2" />
          Назад
        </Button>
      </div>
    </DashboardLayout>
  );
}

