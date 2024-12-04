'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface User {
  id: string
  name: string
}

interface DeleteUserDialogProps {
  user: User
  onClose: () => void
  onDelete: (user: User) => void
}

export function DeleteUserDialog({ user, onClose, onDelete }: DeleteUserDialogProps) {

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/user/${user.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete user')
      
      onDelete(user)
    } catch (error) {
     
    }
  }

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user
            account for {user.name}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

    