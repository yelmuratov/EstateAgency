'use client'

import { useState } from 'react'
import { UserForm } from '@/components/user-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface User {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Editor' | 'Viewer'
}

interface EditUserFormProps {
  user: User
  onClose: () => void
  onUpdate: (user: User) => void
}

export function EditUserForm({ user, onClose, onUpdate }: EditUserFormProps) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: { name: string; email: string; role: string }) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update user')
      const updatedUser = await response.json()
      onUpdate(updatedUser)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <UserForm onSubmit={handleSubmit} loading={loading} defaultValues={user} />
      </DialogContent>
    </Dialog>
  )
}

