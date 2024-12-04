'use client'

import { useState } from 'react'
import { UserForm } from '@/components/user-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface CreateUserFormProps {
  onClose: () => void
}

export function CreateUserForm({ onClose }: CreateUserFormProps) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: { name: string; email: string; role: string }) => {
    setLoading(true)
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create user')
      onClose()
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <UserForm onSubmit={handleSubmit} loading={loading} />
      </DialogContent>
    </Dialog>
  )
}

