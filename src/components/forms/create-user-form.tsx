"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Loader2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { UserStore } from "@/store/users/userStore"
import { AxiosError } from "axios";

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}

interface UserFormData {
  phone: string
  email: string
  full_name: string
  password: string
  password_confirmation: string
}

interface CreateUserFormProps {
  setIsCreateOpen: (isOpen: boolean) => void;
}

interface ErrorResponse {
  detail: string; // Adjust this based on the actual shape of the error response
}


export default function CreateUserForm({ setIsCreateOpen }: CreateUserFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter()
  const { toast } = useToast()
  const { createUser } = UserStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      phone: "+998",
    },
  })

  const onSubmit = async (data: UserFormData) => {
    if (data.password !== data.password_confirmation) {
      setServerError("Пароли не совпадают");
      return;
    }
    try {
        setIsLoading(true);
        setServerError(null); // Reset server error
        const payload = { ...data, is_superuser: false };
        await createUser(payload);

        toast({
            title: "Успех",
            description: "Пользователь успешно создан",
        });
        setIsCreateOpen(false);
        router.refresh();
        router.push("/users");
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response && error.response.data) {
        const responseData = error.response.data as ErrorResponse; // Assert the type here
        const errorMessage = responseData.detail;
    
        if (errorMessage.includes("User phone or email already exists")) {
          setServerError("Телефон или электронная почта уже существуют");
        } else if (errorMessage.includes("Phone number is too long or too short")) {
          setServerError("Номер телефона слишком длинный или слишком короткий");
        } else {
          setServerError(errorMessage);
        }
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось создать пользователя",
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
        <Label htmlFor="full_name">Полное имя</Label>
        <Input
          id="full_name"
          {...register("full_name", {
            required: "Полное имя обязательно",
            minLength: {
              value: 2,
              message: "Полное имя должно быть не менее 2 символов",
            },
          })}
        />
        {errors.full_name && (
          <p className="text-sm text-red-500">{errors.full_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Электронная почта</Label>
        <Input
          id="email"
          type="email"
          {...register("email", {
            required: "Электронная почта обязательна",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Неверный адрес электронной почты",
            },
          })}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Телефон</Label>
        <Input
          id="phone"
          {...register("phone", {
            required: "Номер телефона обязателен",
            pattern: {
              value: /^\+?[1-9]\d{1,14}$/,
              message: "Неверный номер телефона",
            },
          })}
          defaultValue="+998"
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          type="password"
          {...register("password", {
            required: "Пароль обязателен",
            minLength: {
              value: 8,
              message: "Пароль должен быть не менее 8 символов",
            },
          })}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password_confirmation">Подтверждение пароля</Label>
        <Input
          id="password_confirmation"
          type="password"
          {...register("password_confirmation", {
            required: "Подтверждение пароля обязательно",
            minLength: {
              value: 8,
              message: "Пароль должен быть не менее 8 символов",
            },
          })}
        />
        {errors.password_confirmation && (
          <p className="text-sm text-red-500">{errors.password_confirmation.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Создание...
          </>
        ) : (
          "Создать пользователя"
        )}
      </Button>
      {serverError && (
        <p className="text-sm text-red-500 mt-2">{serverError}</p>
      )}
    </form>
  )
}

