'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { EditUserForm } from '@/components/edit-user-form'
import { DeleteUserDialog } from '@/components/delete-user-dialog'

interface User {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Editor' | 'Viewer'
}

interface UserTableProps {
  searchTerm: string
}

export function UserTable({ searchTerm }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      const formattedData = data.map((user: any) => ({
        ...user,
        role: user.role as 'Admin' | 'Editor' | 'Viewer',
      }))
      setUsers(formattedData)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div>Loading...</div>

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => setEditingUser(user)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeletingUser(user)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingUser && (
        <EditUserForm
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdate={(updatedUser) => {
            setUsers(users.map((u) => (u.id === updatedUser.id ? { ...updatedUser, role: updatedUser.role as 'Admin' | 'Editor' | 'Viewer' } : u)))
            setEditingUser(null)
          }}
        />
      )}
      {deletingUser && (
        <DeleteUserDialog
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onDelete={(deletedUser) => {
            setUsers(users.filter((u) => u.id !== deletedUser.id))
            setDeletingUser(null)
          }}
        />
      )}
    </>
  )
}

