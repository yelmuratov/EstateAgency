'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table'
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
import { PropertyFormData } from '@/types/property'
import { useClientStore } from "@/store/clients/useClientStore";
import { useRouter } from "next/navigation";
import { useIsSuperUser } from "@/hooks/useIsSuperUser";
import { useToast } from "@/hooks/use-toast";
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
} from "@/components/ui/alert-dialog";

const columns: ColumnDef<PropertyFormData>[] = [
  {
    accessorKey: 'responsible',
    header: 'Риэлтор',
  },
  {
    accessorKey: 'client_name',
    header: 'Клиент',
  },
  {
    accessorKey: 'date',
    header: 'Дата',
  },
  {
    accessorKey: 'district',
    header: 'Район',
    cell: ({ row }) => (
      <div className="max-w-[200px] overflow-hidden">
        <div className="whitespace-normal break-words">
          {Array.isArray(row.original.district) 
            ? row.original.district.join(', ')
            : row.original.district}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'budget',
    header: 'Бюджет',
  },
  {
    accessorKey: 'client_status',
    header: 'Статус клиента',
    cell: ({ row }) => (
      <div className={`font-medium ${
        row.original.client_status === 'hot' ? 'text-red-500' : 'text-blue-500'
      }`}>
        {row.original.client_status === 'hot' ? 'Горячий' : 'Холодный'}
      </div>
    ),
  },
  {
    accessorKey: 'deal_status',
    header: 'Статус сделки',
    cell: ({ row }) => {
      if (row.original.action_type !== 'sale') return null;
      const statusMap = {
        initial_contact: 'ПЕРВИЧНЫЙ КОНТАКТ',
        negotiation: 'ПЕРЕГОВОРЫ',
        decision_making: 'ПРИНИМАЮТ РЕШЕНИЕ',
        agreement_contract: 'СОГЛАСОВАНИЕ ДОГОВОРА',
        deal: 'СДЕЛКА',
      };
      return statusMap[row.original.deal_status as keyof typeof statusMap] || '-';
    },
  },
  {
    id: 'actions',
    cell: function ActionsCell({ row }) {
      const { deleteClient } = useClientStore();
      const router = useRouter();
      const [isSuperUser] = useIsSuperUser();
      const { toast } = useToast();
      const [deleteId, setDeleteId] = useState<number | null>(null);

      const handleDelete = async () => {
        if (deleteId === null) return;
        try {
          await deleteClient(deleteId);
          toast({
            title: "Клиент удален",
            description: "Клиент успешно удален",
          });
          setDeleteId(null);
        } catch {
          toast({
            title: "Ошибка",
            description: "Не удалось удалить клиента",
            variant: "destructive",
          });
        }
      };

      return (
        <div className="flex space-x-2">
          <Button
            onClick={() => router.push(`/edit-client/${row.original.id}`)}
            variant="default"
          >
            Редактировать
          </Button>
          {isSuperUser && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  onClick={() => setDeleteId(row.original.id)}
                  variant="destructive"
                >
                  Удалить
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить клиента</AlertDialogTitle>
                  <AlertDialogDescription>
                    Вы уверены, что хотите удалить этого клиента? Это действие нельзя отменить.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      );
    },
  },
]

interface ClientsTableProps {
  data: PropertyFormData[]
}

export function ClientsTable({ data }: ClientsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Нет результатов.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Предыдущая
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Следующая
        </Button>
      </div>
    </div>
  )
}

