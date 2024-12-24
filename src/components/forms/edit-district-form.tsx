"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface DistrictFormData {
  name: string;
}

interface EditDistrictFormProps {
  district: { id: number; name: string };
  onEdit: (districtId: number, name: string) => Promise<void>;
}

export default function EditDistrictForm({ district, onEdit }: EditDistrictFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<DistrictFormData>({
    defaultValues: { name: district.name },
  });

  useEffect(() => {
    reset(district);
  }, [district, reset]);

  const onSubmit = async (data: DistrictFormData) => {
    try {
      setIsLoading(true);
      setServerError(null); // Reset server error
      await onEdit(district.id, data.name);
      toast({
        title: "Успех",
        description: "Район успешно обновлен",
      });
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
      } else if (axios.isAxiosError(error) && error.response && error.response.status === 500) {
        setError("name", {
          type: "manual",
          message: "Произошла ошибка на сервере. Пожалуйста, попробуйте снова.",
        });
      } else {
        setServerError("Не удалось обновить район");
        toast({
          title: "Ошибка",
          description: "Не удалось обновить район",
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
            Обновление...
          </>
        ) : (
          "Обновить район"
        )}
      </Button>
      {serverError && (
        <p className="text-sm text-red-500 mt-2">{serverError}</p>
      )}
    </form>
  );
}
