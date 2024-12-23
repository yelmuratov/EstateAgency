"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import usePropertyStore from "@/store/MetroDistrict/propertyStore"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import CreateDistrictForm from "@/components/forms/create-district-form"
import EditDistrictForm from "@/components/forms/edit-district-form"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import { useIsSuperUser } from "@/hooks/useIsSuperUser"

interface District {
  id: number
  name: string
}

export default function DistrictsTable() {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const { districts,fetchDistricts,deleteDistrict } = usePropertyStore()
  const router = useRouter()
  const { toast } = useToast()
  const isSuperUser = useIsSuperUser()

  useEffect(() => {
    if(!isSuperUser){
        router.push('/404')
        }
    }, [isSuperUser])

  useEffect(() => {
    fetchDistricts()
  }
, [fetchDistricts])

  const handleDelete = async (districtId: number) => {

    try {
      await deleteDistrict(districtId)
      toast({
        title: "Success",
        description: "District deleted successfully",
      })
      router.refresh()
    } catch (error) {
      // Revert on error
      toast({
        title: "Error",
        description: "Failed to delete district",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
            <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Districts</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add District
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New District</DialogTitle>
            </DialogHeader>
            <CreateDistrictForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {districts.map((district) => (
              <TableRow key={district.id}>
                <TableCell>{district.name}</TableCell>
                <TableCell className="text-right">
                  <Dialog open={isEditOpen && selectedDistrict?.id === district.id} 
                         onOpenChange={(open) => {
                           setIsEditOpen(open)
                           if (!open) setSelectedDistrict(null)
                         }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedDistrict(district)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit District</DialogTitle>
                      </DialogHeader>
                      {selectedDistrict && (
                        <EditDistrictForm  />
                      )}
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete District</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this district? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(district.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    </DashboardLayout>
  )
}

