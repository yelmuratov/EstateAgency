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
        title: "Success",
        description: "Metro station created successfully",
      })
      router.refresh()
      router.push("/metro")
    } catch{
      toast({
        title: "Error",
        description: "Failed to create metro station",
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
            Creating...
          </>
        ) : (
          "Create Metro Station"
        )}
      </Button>
      {/* back button */}
      <Button
        variant="outline"
        onClick={() => router.push("/metro")}
        className="w-full"
      >
        Back
      </Button>
    </form>
  )
}

