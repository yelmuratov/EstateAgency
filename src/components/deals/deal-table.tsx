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
import { useState, useEffect } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useDealStore } from '@/store/deals/useDealStore';
import { Deal } from "@/types/deal";
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
import Spinner from '../local-components/spinner'

const actionTypeTranslation: { [key: string]: string } = {
  rent: "Аренда",
  sale: "Продажа",
};

const columns: ColumnDef<Deal>[] = [
  {
    accessorKey: 'action_type',
    header: 'Тип действия',
    cell: ({ row }) => actionTypeTranslation[row.original.action_type] || row.original.action_type,
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
    accessorKey: 'object_price',
    header: 'Цена объекта',
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
    accessorKey: 'crm_id',
    header: 'CRM ID',
  },
  {
    id: 'actions',
    cell: function ActionsCell({ row }) {
      const { deleteDeal } = useDealStore();
      const [isSuperUser] = useIsSuperUser();
      const { toast } = useToast();
      const [deleteId, setDeleteId] = useState<number | null>(null);

      const handleDelete = async () => {
        if (deleteId === null) return;
        try {
          await deleteDeal(deleteId);
          toast({
            title: "Сделка удалена",
            description: "Сделка успешно удалена",
          });
          setDeleteId(null);
        } catch {
          toast({
            title: "Ошибка",
            description: "Не удалось удалить сделку",
            variant: "destructive",
          });
        }
      };

      return (
        <div className="flex space-x-2">
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
                  <AlertDialogTitle>Удалить сделку</AlertDialogTitle>
                  <AlertDialogDescription>
                    Вы уверены, что хотите удалить эту сделку? Это действие нельзя отменить.
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

interface DealsTableProps {
  data: Deal[];
  type: 'rent' | 'sale';
}

export function DealsTable({type }: DealsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const { fetchDeals } = useDealStore();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { deals } = await fetchDeals(type, 1, 10);
      setDeals(deals);
      setLoading(false);
    };

    fetchData();
  }, [type, fetchDeals]);

  const table = useReactTable({
    data: deals,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  if (loading) {
    return <Spinner theme='dark' />
  }

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
    </div>
  )
}
