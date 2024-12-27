"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from 'lucide-react';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import { useViewStore, ViewFormData } from "@/store/views/useViewStore";
import { UserStore, User } from "@/store/users/userStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  action_type: z.enum(["SALE", "RENT"]),
  responsible: z.string().min(2, "Минимум 2 символа"),
  date: z.string().min(1, "Выберите дату"),
  time: z.string().min(1, "Выберите время"),
  district: z.string().min(2, "Минимум 2 символа"),
  price: z.number().min(1, "Введите цену"),
  commission: z.number().min(1, "Введите комиссию"),
  agent_percent: z.number().min(1, "Введите процент агента"),
  status_deal: z.boolean(),
  crm_id: z.string().min(1, "Введите CRM ID"),
  client_number: z.string().min(1, "Введите номер клиента"),
  owner_number: z.string().min(1, "Введите номер владельца"),
});

interface EditViewFormProps {
  viewId: number;
  initialData: ViewFormData;
}

export function EditViewForm({ viewId, initialData }: EditViewFormProps) {
  const router = useRouter();
  const { updateView } = useViewStore();
  const { getUsers } = UserStore();
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, [getUsers]);

  const form = useForm<ViewFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Form errors:", form.formState.errors);
    }
  }, [form.formState.errors]);

  const handleSubmit = async (data: ViewFormData) => {
    try {
      data.date = format(new Date(data.date), "yyyy-MM-dd");
      await updateView(viewId, data);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="action_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тип действия</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип действия" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SALE">Продажа</SelectItem>
                    <SelectItem value="RENT">Аренда</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="responsible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ответственный</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите ответственного" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.email} value={user.full_name}>
                        {user.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Дата</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "dd.MM.yyyy")
                      ) : (
                        <span>Выберите дату</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date?.toISOString())}
                    initialFocus
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Время</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Район</FormLabel>
              <FormControl>
                <Input placeholder="Введите район" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Цена</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Введите цену"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="commission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Комиссия</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Введите комиссию"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agent_percent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Процент агента</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Введите процент агента"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status_deal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Статус сделки</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value ? "true" : "false"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус сделки" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Завершена</SelectItem>
                    <SelectItem value="false">Не завершена</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="crm_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CRM ID</FormLabel>
              <FormControl>
                <Input placeholder="Введите CRM ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="client_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Номер клиента</FormLabel>
              <FormControl>
                <Input placeholder="Введите номер клиента" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="owner_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Номер владельца</FormLabel>
              <FormControl>
                <Input placeholder="Введите номер владельца" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Обновление..." : "Обновить"}
        </Button>
      </form>
        </Form>
      );
    }