"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import CreateUserForm from "@/components/forms/create-user-form"
import EditUserForm from "@/components/forms/edit-user-form"
import { UserStore } from "@/store/users/userStore"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import { useIsSuperUser } from "@/hooks/useIsSuperUser"
import Spinner from "@/components/local-components/spinner"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  is_superuser: boolean;
  disabled: boolean;
  created_at: string;
  updated_at: string;
  hashed_password: string;
}

export default function UsersTable() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const {users, fetchUsers, deleteUser, setUsers} = UserStore()
  const [isSuperUser, isSuperUserLoading] = useIsSuperUser()
  const router = useRouter()
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    if (!isSuperUserLoading && !isSuperUser) {
      router.push('/')
    }
  }, [isSuperUser, isSuperUserLoading, router])

  useEffect(() => {
    setTotalPages(Math.ceil(users.length / usersPerPage))
  }, [users, usersPerPage])

  if (isSuperUserLoading) {
    return <Spinner theme="dark" />
  }

  if (!isSuperUser) {
    return null
  }

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId)
      toast({
        title: "Успех",
        description: "Пользователь успешно удален",
      })
      setUsers(users.filter(user => user.id !== userId))
      router.refresh()
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить пользователя",
        variant: "destructive",
      })
    }
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const ellipsis = <PaginationItem key="ellipsis"><PaginationEllipsis /></PaginationItem>;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => paginate(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => paginate(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(ellipsis);
      }

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => paginate(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(ellipsis);
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => paginate(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-4">
          <Button onClick={() => router.push('/')}>
            Назад
          </Button>
          <h2 className="text-2xl font-bold">Пользователи</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Добавить пользователя
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Создать нового пользователя</DialogTitle>
              </DialogHeader>
              <CreateUserForm setIsCreateOpen={setIsCreateOpen} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Полное имя</TableHead>
                <TableHead>Электронная почта</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Super User</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.is_superuser ? "Да" : "Нет"}</TableCell>
                  <TableCell className="text-right">
                    <Dialog 
                      open={isEditOpen && selectedUser?.id === user.id} 
                      onOpenChange={(open) => {
                        setIsEditOpen(open)
                        if (!open) setSelectedUser(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedUser(user as User)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Редактировать пользователя</DialogTitle>
                        </DialogHeader>
                        {selectedUser && (
                          <EditUserForm user={selectedUser} setIsEditOpen={setIsEditOpen} />
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
                          <AlertDialogTitle>Удалить пользователя</AlertDialogTitle>
                          <AlertDialogDescription>
                            Вы уверены, что хотите удалить этого пользователя? Это действие нельзя будет отменить.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => user.id && handleDelete(user.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  {currentPage > 1 && (
                    <PaginationPrevious 
                      onClick={() => paginate(currentPage - 1)}
                    />
                  )}
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  {currentPage < totalPages && (
                    <PaginationNext 
                      onClick={() => paginate(currentPage + 1)}
                    />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

