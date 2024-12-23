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

interface MetroFormData {
  name: string
}

export default function EditMetroForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const params = useParams();
  const metroId = params?.id as string;
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MetroFormData>()

  useEffect(() => {
    const fetchMetro = async () => {
      try {
        const response = await api.get(`/metro/${metroId}`)
        reset(response.data)
      } catch{
        toast({
          title: "Error",
          description: "Failed to fetch metro station data",
          variant: "destructive",
        })
      }
    }

    fetchMetro()
  }, [metroId, reset, toast])

  const onSubmit = async (data: MetroFormData) => {
    try {
      setIsLoading(true)
      await api.put(`/metro/${metroId}`, data)

      toast({
        title: "Success",
        description: "Metro station updated successfully",
      })
      router.refresh()
      router.push("/metro")
    } catch{
      toast({
        title: "Error",
        description: "Failed to update metro station",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Metro Station Name</Label>
        <Input
          id="name"
          {...register("name", {
            required: "Metro station name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
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
            Updating...
          </>
        ) : (
          "Update Metro Station"
        )}
      </Button>
    </form>
  )
}

