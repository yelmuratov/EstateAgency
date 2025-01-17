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
import { MultiSelect } from "@/components/ui/multi-select";
import { useRouter } from "next/navigation";
import { useClientStore } from "@/store/clients/useClientStore";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyFormData, PropertyType } from "@/types/property";
import usePropertyStore from "@/store/MetroDistrict/propertyStore";
import { District } from "@/store/MetroDistrict/propertyStore";
import Spinner from "../local-components/spinner";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  responsible: z.string().min(2, "Минимум 2 символа"),
  client_name: z.string().min(2, "Минимум 2 символа"),
  date: z.string().min(1, "Выберите дату"),
  district: z.array(z.string()).nonempty("Выберите хотя бы один район"),
  budget: z.number().min(1, "Введите бюджет"),
  client_status: z.enum(["hot", "cold"], {
    required_error: "Выберите статус клиента",
  }),
  comment: z.string(),
  action_type: z.enum(["rent", "sale"]),
  deal_status: z.enum(["initial_contact", "negotiation", "decision_making", "agreement_contract", "deal"]).optional(),
});

interface PropertyFormProps {
  type: PropertyType;
}

export function ClientForm({ type }: PropertyFormProps) {
  const router = useRouter();
  const { postClient } = useClientStore();
  const [districts, setDistricts] = useState<District[]>([]);
  const { returnDistricts, loading, error } = usePropertyStore();
  const { getUsers } = UserStore();
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDistricts = async () => {
      const response = await returnDistricts();
      setDistricts(response);
    };

    fetchDistricts();
  }, [returnDistricts]);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, [getUsers]);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsible: "",
      client_name: "",
      date: "",
      district: [],
      budget: undefined,
      client_status: "cold",
      comment: "",
      action_type: type,
      deal_status: type === "sale" ? "initial_contact" : undefined,
    },
  });

  if (loading) return <Spinner theme="dark" />;

  if (error) return <div>Failed to fetch districts: {error}</div>;

  const handleSubmit = async (data: PropertyFormData) => {
    try {
      data.date = format(new Date(data.date), "yyyy-MM-dd");
      if (typeof data.district === "string") {
        data.district = [data.district];
      }
      await postClient(data);
      router.push("/");
    } catch (error) {
      const err = error as { detail?: { msg: string; ctx?: { expected: string } }[] } | { detail: string; status: number };
      if ('status' in err && err.status === 400 && typeof err.detail === 'string') {
        toast({
          title: "Ошибка при создании клиента",
          description: err.detail,
          variant: "destructive",
        });
      } else if ('detail' in err && Array.isArray(err.detail) && err.detail.length > 0) {
        const errorMessage = err.detail[0].ctx?.expected || err.detail[0].msg;
        toast({
          title: "Ошибка при создании клиента",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Ошибка при создании клиента",
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
          name="responsible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя риэлтора</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите риэлтора" />
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
          name="client_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя клиента</FormLabel>
              <FormControl>
                <Input placeholder="Введите имя клиента" {...field} />
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
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Район</FormLabel>
              <FormControl>
                {type === "rent" ? (
                  <MultiSelect value={field.value} onChange={field.onChange} />
                ) : (
                  <Select
                    onValueChange={(value) => field.onChange([value])}
                    value={field.value?.[0] || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите район" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.id} value={district.name}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Бюджет</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Введите бюджет"
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
          name="client_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Статус клиента</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ?? undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="hot">Горячий</SelectItem>
                  <SelectItem value="cold">Холодный</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Комментарий</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Введите комментарий"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === "sale" && (
          <FormField
            control={form.control}
            name="deal_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Статус сделки</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус сделки" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="initial_contact">ПЕРВИЧНЫЙ КОНТАКТ</SelectItem>
                    <SelectItem value="negotiation">ПЕРЕГОВОРЫ</SelectItem>
                    <SelectItem value="decision_making">ПРИНИМАЮТ РЕШЕНИЕ</SelectItem>
                    <SelectItem value="agreement_contract">СОГЛАСОВАНИЕ ДОГОВОРА</SelectItem>
                    <SelectItem value="deal">СДЕЛКА</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full">
          Сохранить
        </Button>
      </form>
    </Form>
  );
}

