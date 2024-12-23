"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Loader2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"

interface UserFormData {
  phone: string
  email: string
  full_name: string
  password: string
  is_superuser: boolean
}

export default function CreateUserForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>()

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true)
      await api.post("/users/", {
        phone: data.phone,
        email: data.email,
        full_name: data.full_name,
        hashed_password: data.password,
        is_superuser: data.is_superuser,
      })

      toast({
        title: "Успех",
        description: "Пользователь успешно создан",
      })
      router.refresh()
      router.push("/users")
    } catch{
      toast({
        title: "Ошибка",
        description: "Не удалось создать пользователя",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_superuser"
          {...register("is_superuser")}
        />
        <Label htmlFor="is_superuser">Суперпользователь</Label>
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
    </form>
  )
}

