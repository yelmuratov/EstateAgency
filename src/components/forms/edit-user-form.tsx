"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { UserStore } from "@/store/users/userStore"
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"

interface User {
  id: string
  email: string
  full_name: string
  phone: string
  is_superuser: boolean
  disabled: boolean
  created_at: string
  updated_at: string
  hashed_password: string
}

interface EditUserFormProps {
  user: User
  setIsEditOpen: (isOpen: boolean) => void
}

interface ApiError {
  response?: {
    status: number
    data: {
      detail: string
    }
  }
}

export default function EditUserForm({ user, setIsEditOpen }: EditUserFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("");
  const router = useRouter()
  const { toast } = useToast()
  const { updateUser } = UserStore()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<User>()

  useEffect(() => {
    if (user) {
      reset(user)
    }
  }, [user, reset])

  const onSubmit = async (data: User) => {
    try {
      setIsLoading(true)
      const changedFields: Record<string, string | boolean> = {}
      
      if (data.full_name !== user.full_name) changedFields.full_name = data.full_name
      if (data.email !== user.email) changedFields.email = data.email
      if (data.phone !== user.phone) changedFields.phone = data.phone
      if (data.is_superuser !== user.is_superuser) changedFields.is_superuser = data.is_superuser
      if (password) changedFields.hashed_password = password

      if (Object.keys(changedFields).length === 0) {
        toast({ title: "Без изменений", description: "Поля не были изменены" })
        setIsEditOpen(false)
        return
      }

      await updateUser(user.id, changedFields)

      toast({ title: "Успех", description: "Пользователь успешно обновлен" })
      router.refresh()
      setIsEditOpen(false)
    } catch (error: unknown) {
      const apiError = error as ApiError
      if (apiError.response?.status === 400) {
        if (apiError.response.data.detail === "Already exists user with this phone") {
          setError("phone", { type: "manual", message: "Пользователь с таким номером телефона уже существует" })
        } else if (apiError.response.data.detail === "Already exists user with this email") {
          setError("email", { type: "manual", message: "Пользователь с таким адресом электронной почты уже существует" })
        }
      } else {
        toast({ title: "Ошибка", description: "Не удалось обновить пользователя", variant: "destructive" })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
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
        {errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email", {
            required: "Email обязателен",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Неверный адрес электронной почты",
            },
          })}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
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
        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="is_superuser">Суперпользователь</Label>
        <Select
          defaultValue={user.is_superuser ? "true" : "false"} // Set initial value from db
          onValueChange={(value) => {
            const isSuperuser = value === "true"
            reset({ ...watch(), is_superuser: isSuperuser })
          }}
        >
          <SelectTrigger id="is_superuser" />
          <SelectContent>
            <SelectItem value="true">Да</SelectItem>
            <SelectItem value="false">Нет</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update User"
        )}
      </Button>
    </form>
  )
}

