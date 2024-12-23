"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"

interface DistrictFormData {
  name: string
}

export default function EditDistrictForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const params = useParams();
  const districtId = params?.id as string

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DistrictFormData>()

  useEffect(() => {
    const fetchDistrict = async () => {
      try {
        const response = await api.get(`/district/${districtId}`)
        reset(response.data)
      } catch{
        toast({
          title: "Ошибка",
          description: "Не удалось получить данные района",
          variant: "destructive",
        })
      }
    }

    fetchDistrict()
  }, [districtId, reset, toast])

  const onSubmit = async (data: DistrictFormData) => {
    try {
      setIsLoading(true)
      await api.put(`/district/${districtId}`, data)

      toast({
        title: "Успех",
        description: "Район успешно обновлен",
      })
      router.refresh()
      router.push("/districts")
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить район",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
    </form>
  )
}
