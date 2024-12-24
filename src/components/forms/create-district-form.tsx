"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import usePropertyStore from "@/store/MetroDistrict/propertyStore";

interface DistrictFormData {
  name: string;
}

export default function CreateDistrictForm({
  setIsCreateOpen,
}: {
  setIsCreateOpen: (isOpen: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { createDistrict } = usePropertyStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<DistrictFormData>();

  const onSubmit = async (data: DistrictFormData) => {
    try {
      setIsLoading(true);
      await createDistrict(data.name);

      toast({
        title: "Успех",
        description: "Район успешно создан",
      });

      setIsCreateOpen(false); // Close the modal only if successful
      router.refresh();
      router.push("/districts");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        const apiErrors = error.response.data.errors || error.response.data;
        if (apiErrors.detail) {
          setError("name", {
            type: "manual",
            message:
              apiErrors.detail === "District already exists"
                ? "Район уже существует"
                : apiErrors.detail,
          });
        } else {
          for (const key in apiErrors) {
            if (apiErrors.hasOwnProperty(key)) {
              setError(key as keyof DistrictFormData, {
                type: "manual",
                message: apiErrors[key].join(", "),
              });
            }
          }
        }
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось создать район",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Название района</Label>
        <Input
          id="name"
          {...register("name", {
            required: "Название района обязательно",
            minLength: {
              value: 2,
              message: "Название должно быть не менее 2 символов",
            },
          })}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Создание...
          </>
        ) : (
          "Создать район"
        )}
      </Button>
    </form>
  );
}
