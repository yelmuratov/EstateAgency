'use client'

import { useState } from 'react'
import { ViewForm } from '@/components/clients/client-form'
import { PropertyFormData } from '@/types/property'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DashboardLayout from '@/components/layouts/DashboardLayout'

export default function PropertyPage() {
  const [properties, setProperties] = useState<PropertyFormData[]>([])

  const handleSubmit = (data: PropertyFormData) => {
    setProperties([...properties, data])
  }

  return (
    <DashboardLayout>
        <div className="container mx-auto py-10">
      <Tabs defaultValue="rent" className="space-y-6">
        <TabsList>
          <TabsTrigger value="rent">Аренда</TabsTrigger>
          <TabsTrigger value="sale">Продажа</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rent" className="space-y-6">
          <ViewForm type="rent" onSubmit={handleSubmit} />
        </TabsContent>
        
        <TabsContent value="sale" className="space-y-6">
          <ViewForm type="sale" onSubmit={handleSubmit} />
        </TabsContent>
      </Tabs>
    </div>
    </DashboardLayout>
  )
}

