"use client";

import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { useForm, Controller } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import usePropertyStore from "@/store/MetroDistrict/propertyStore";
import { useClientStore } from "@/store/clients/useClientStore";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Toaster } from "@/components/ui/toaster";
import Spinner from "@/components/local-components/spinner";
import { UserStore } from "@/store/userStore";
import useAuth from "@/hooks/useAuth";
import { UserStore as usersStore } from "@/store/users/userStore";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ClientFormData {
  responsible: string;
  client_name: string;
  date: string;
  district: string[];
  budget: number;
  client_status: "hot" | "cold";
  comment?: string;
  action_type: "rent" | "sale";
  deal_status?: "initial_contact" | "negotiation" | "decision_making" | "agreement_contract" | "deal";
  id?: number;
}

export default function EditClientPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  useAuth();

  const { districts, fetchDistricts } = usePropertyStore();
  const { users, fetchUsers } = usersStore();
  const { fetchClientById, updateClient } = useClientStore();
  const { user } = UserStore();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  const errorTranslations: { [key: string]: string } = {
    "401: This object created by another agent":
      "401: Этот объект создан другим агентом",
    "Network Error: Unable to reach the server.":
      "Ошибка сети: Не удалось подключиться к серверу.",
    "Server Error: 500": "Ошибка сервера: 500",
    // Add more translations as needed
  };

  const translateError = (message: string): string => {
    return errorTranslations[message] || message; // Fallback to the original message
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>();

  useEffect(() => {
    fetchDistricts();
    fetchUsers();
  }, [fetchDistricts, fetchUsers]);

  const [initialData, setInitialData] = useState<ClientFormData | null>(null);

  useEffect(() => {
    const loadClient = async () => {
      if (id) {
        try {
          const clientData = await fetchClientById(Number(id));
          if (clientData) {
            const mappedData: ClientFormData = {
              responsible: clientData.responsible || "",
              client_name: clientData.client_name || "",
              date: clientData.date || "",
              district: clientData.district || [],
              budget: clientData.budget || 0,
              client_status: clientData.client_status as "hot" | "cold",
              comment: clientData.comment || "",
              action_type: clientData.action_type as "rent" | "sale",
              deal_status: clientData.deal_status as ClientFormData["deal_status"],
              id: clientData.id || 0,
            };

            setInitialData(mappedData);
            reset(mappedData);
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
  }, [id, fetchClientById, reset, toast]);

  if (loading) {
    return <Spinner theme="dark" />;
  }

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (!initialData) {
        throw new Error("Initial data not loaded.");
      }

      const queryParams: Record<string, string> = {};
      let hasTextChanges = false;

      (Object.keys(data) as (keyof ClientFormData)[]).forEach((key) => {
        const currentValue = data[key];
        const initialValue = initialData[key];

        if (currentValue !== initialValue) {
          queryParams[key] = currentValue?.toString() || "";
          hasTextChanges = true;
        }
      });

      if (!hasTextChanges) {
        toast({
          title: "No changes detected",
          description: "No changes were made to the client data.",
          variant: "default",
        });
        return;
      }

      setIsSubmitting(true);

      const queryString = new URLSearchParams(queryParams).toString();
      const url = `/client/${id}${queryString ? `?${queryString}` : ""}`;

      await api.put(url, queryParams);

      toast({
        title: "Success",
        description: "Client updated successfully.",
        variant: "default",
      });
      router.push("/");
    } catch (error: unknown) {
      let errorMessage = "Произошла непредвиденная ошибка.";

      if (error && typeof error === "object" && "isAxiosError" in error) {
        const axiosError = error as AxiosError<{
          detail?: string | Record<string, string>;
        }>;

        if (axiosError.response) {
          const detail = axiosError.response.data?.detail;

          if (typeof detail === "string") {
            // Handle a single string error message
            errorMessage = translateError(detail);
          } else if (typeof detail === "object" && detail !== null) {
            // Handle validation error object (e.g., 422)
            errorMessage = Object.values(detail)
              .map((msg) => `${msg}`)
              .join(", ");
          } else {
            // Fallback for server errors
            errorMessage = translateError(
              `Server Error: ${axiosError.response.status}`
            );
          }
        } else {
          // Network error
          errorMessage = translateError(
            "Network Error: Unable to reach the server."
          );
        }
      } else if (error instanceof Error) {
        // Handle generic JavaScript errors
        errorMessage = translateError(error.message);
      }

      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl mx-auto"
      >
        <Toaster />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="responsible">Риэлтор</Label>
            <Controller
              name="responsible"
              control={control}
              rules={{ required: "Это поле обязательно" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите риэлтора" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.full_name}>
                        {user.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.responsible && (
              <p className="text-red-500 text-sm mt-1">
                {errors.responsible.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_name">Имя клиента</Label>
            <Input
              id="client_name"
              {...register("client_name", {
                required: "Это поле обязательно",
                minLength: { value: 2, message: "Минимум 2 символа" },
              })}
              placeholder="Введите имя клиента"
            />
            {errors.client_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.client_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Дата</Label>
            <Controller
              name="date"
              control={control}
              rules={{ required: "Это поле обязательно" }}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "yyyy-MM-dd")
                      ) : (
                        <span>Выберите дату</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">Район</Label>
            <Controller
              name="district"
              control={control}
              rules={{ required: "Это поле обязательно" }}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange([value])}
                  value={field.value?.[0] || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите район" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district.id} value={district.name}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.district && (
              <p className="text-red-500 text-sm mt-1">
                {errors.district.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Бюджет</Label>
            <Input
              id="budget"
              type="number"
              {...register("budget", {
                required: "Это поле обязательно",
                valueAsNumber: true,
              })}
              placeholder="Введите бюджет"
            />
            {errors.budget && (
              <p className="text-red-500 text-sm mt-1">
                {errors.budget.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_status">Статус клиента</Label>
            <Controller
              name="client_status"
              control={control}
              rules={{ required: "Это поле обязательно" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус клиента" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot">Горячий</SelectItem>
                    <SelectItem value="cold">Холодный</SelectItem>
                    </SelectContent>
                </Select>
              )}
            />
            {errors.client_status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.client_status.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="action_type">Тип действия</Label>
            <Controller
              name="action_type"
              control={control}
              rules={{ required: "Это поле обязательно" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип действия" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">Аренда</SelectItem>
                    <SelectItem value="sale">Продажа</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.action_type && (
              <p className="text-red-500 text-sm mt-1">
                {errors.action_type.message}
              </p>
            )}
          </div>

          {initialData?.action_type === "sale" && (
            <div className="space-y-2">
              <Label htmlFor="deal_status">Статус сделки</Label>
              <Controller
                name="deal_status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус сделки" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initial_contact">
                        ПЕРВИЧНЫЙ КОНТАКТ
                      </SelectItem>
                      <SelectItem value="negotiation">ПЕРЕГОВОРЫ</SelectItem>
                      <SelectItem value="decision_making">
                        ПРИНИМАЮТ РЕШЕНИЕ
                      </SelectItem>
                      <SelectItem value="agreement_contract">
                        СОГЛАСОВАНИЕ ДОГОВОРА
                      </SelectItem>
                      <SelectItem value="deal">СДЕЛКА</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment">Комментарий</Label>
          <Textarea
            id="comment"
            {...register("comment", {
              maxLength: { value: 6000, message: "Максимум 6000 символов" },
            })}
            placeholder="Введите комментарий (необязательно)"
          />
          {errors.comment && (
            <p className="text-red-500 text-sm mt-1">
              {errors.comment.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Обновление...
            </>
          ) : (
            "Обновить клиента"
          )}
        </Button>
        <Button
          type="button"
          onClick={() => router.push("/")}
          className="w-full"
        >
          <ArrowLeft className="mr-2" />
          Назад
        </Button>
      </form>
    </DashboardLayout>
  );
}
