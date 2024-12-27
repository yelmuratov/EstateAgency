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
import { ViewFormData } from '@/store/views/useViewStore';
import { useViewStore } from "@/store/views/useViewStore";
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

const columns: ColumnDef<ViewFormData>[] = [
  {
    accessorKey: 'action_type',
    header: 'Тип действия',
  },
  {
    accessorKey: 'responsible',
    header: 'Ответственный',
  },
  {
    accessorKey: 'date',
    header: 'Дата',
  },
  {
    accessorKey: 'time',
    header: 'Время',
  },
  {
    accessorKey: 'district',
    header: 'Район',
  },
  {
    accessorKey: 'price',
    header: 'Цена',
  },
  {
    accessorKey: 'commission',
    header: 'Комиссия',
  },
  {
    accessorKey: 'agent_percent',
    header: 'Процент агента',
  },
  {
    accessorKey: 'status_deal',
    header: 'Статус сделки',
    cell: ({ row }) => (
      <div className={`font-medium ${row.original.status_deal ? 'text-green-500' : 'text-red-500'}`}>
        {row.original.status_deal ? 'Завершена' : 'Не завершена'}
      </div>
    ),
  },
  {
    accessorKey: 'crm_id',
    header: 'CRM ID',
  },
  {
    accessorKey: 'client_number',
    header: 'Номер клиента',
  },
  {
    accessorKey: 'owner_number',
    header: 'Номер владельца',
  },
  {
    id: 'actions',
    cell: function ActionsCell({ row }) {
      const { deleteView } = useViewStore();
      const router = useRouter();
      const [isSuperUser] = useIsSuperUser();
      const { toast } = useToast();
      const [deleteId, setDeleteId] = useState<number | null>(null);

      const handleDelete = async () => {
        if (deleteId === null) return;
        try {
          await deleteView(deleteId);
          toast({
            title: "Просмотр удален",
            description: "Просмотр успешно удален",
          });
          setDeleteId(null);
        } catch {
          toast({
            title: "Ошибка",
            description: "Не удалось удалить просмотр",
            variant: "destructive",
          });
        }
      };

      return (
        <div className="flex space-x-2">
          <Button
            onClick={() => router.push(`/edit-view/${row.original.id}`)}
            variant="default"
          >
            Редактировать
          </Button>
          {isSuperUser && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  onClick={() => setDeleteId(row.original.id ?? null)}
                  variant="destructive"
                >
                  Удалить
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить просмотр</AlertDialogTitle>
                  <AlertDialogDescription>
                    Вы уверены, что хотите удалить этот просмотр? Это действие нельзя отменить.
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

interface ViewsTableProps {
  data: ViewFormData[]
}

export function ViewsTable({ data }: ViewsTableProps) {
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
