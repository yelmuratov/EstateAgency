"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Loader2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"

interface DistrictFormData {
  name: string
}

interface EditDistrictFormProps {
  districtId: string
}

export default function EditDistrictForm({ districtId }: EditDistrictFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

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
          title: "Error",
          description: "Failed to fetch district data",
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
        title: "Success",
        description: "District updated successfully",
      })
      router.refresh()
      router.push("/districts")
    } catch {
      toast({
        title: "Error",
        description: "Failed to update district",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">District Name</Label>
        <Input
          id="name"
          {...register("name", {
            required: "District name is required",
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
          "Update District"
        )}
      </Button>
    </form>
  )
}

