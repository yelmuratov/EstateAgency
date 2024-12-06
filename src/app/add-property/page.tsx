'use client';

import React from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import AddPropertyForm from '@/components/AddPropertyForm'
import useAuth  from '@/hooks/useAuth'

const AddPropertyPage: React.FC = () => {
  useAuth();
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Добавить Объект</h1>
        <AddPropertyForm />
      </div>
    </DashboardLayout>
  )
}

export default AddPropertyPage

