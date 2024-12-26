'use client'

import { ViewForm } from '@/components/clients/client-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DashboardLayout from '@/components/layouts/DashboardLayout'

export default function PropertyPage() {
  return (
    <DashboardLayout>
        <div className="container mx-auto py-10">
      <Tabs defaultValue="rent" className="space-y-6">
        <TabsList>
          <TabsTrigger value="rent">Аренда</TabsTrigger>
          <TabsTrigger value="sale">Продажа</TabsTrigger>
        </TabsList>
        <TabsContent value="rent" className="space-y-6">
          <ViewForm type="rent"/>
        </TabsContent>
        
        <TabsContent value="sale" className="space-y-6">
          <ViewForm type="sale"/>
        </TabsContent>
      </Tabs>
    </div>
    </DashboardLayout>
  )
}

