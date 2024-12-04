'use client'

import { useState } from 'react'
import { UserTable } from '@/components/user-table'
import { CreateUserForm } from '@/components/create-user-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusIcon } from 'lucide-react'
import Spinner from '@/components/local-components/spinner';
import useAuth from '@/hooks/useAuth';
import DashboarLayout from '@/components/layouts/DashboardLayout';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const { loading, token } = useAuth();

  if (loading) {
      return <Spinner />; // Show a spinner while checking auth
  }

  return (
    <DashboarLayout>
        <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <UserTable searchTerm={searchTerm} />
      {showCreateForm && (
        <CreateUserForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
    </DashboarLayout>
  )
}