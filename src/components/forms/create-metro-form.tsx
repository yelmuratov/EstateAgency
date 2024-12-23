"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Loader2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"

interface MetroFormData {
  name: string
}

export default function CreateMetroForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MetroFormData>()

  const onSubmit = async (data: MetroFormData) => {
    try {
      setIsLoading(true)
      await api.post("/metro/", data)

      toast({
        title: "Успех",
        description: "Станция метро успешно создана",
      })
      router.refresh()
      router.push("/metro")
    } catch{
      toast({
        title: "Ошибка",
        description: "Не удалось создать станцию метро",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Название станции метро</Label>
        <Input
          id="name"
          {...register("name", {
            required: "Название станции метро обязательно",
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
          "Создать станцию метро"
        )}
      </Button>
    </form>
  )
}

