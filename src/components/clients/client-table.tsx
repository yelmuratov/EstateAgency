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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { PropertyFormData } from '@/types/property'

const columns: ColumnDef<PropertyFormData>[] = [
  {
    accessorKey: 'realtorName',
    header: 'Риэлтор',
  },
  {
    accessorKey: 'clientName',
    header: 'Клиент',
  },
  {
    accessorKey: 'date',
    header: 'Дата',
  },
  {
    accessorKey: 'district',
    header: 'Район',
  },
  {
    accessorKey: 'budget',
    header: 'Бюджет',
  },
  {
    accessorKey: 'clientStatus',
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
    accessorKey: 'dealStatus',
    header: 'Статус сделки',
    cell: ({ row }) => {
      if (row.original.action_type !== 'sale') return null
      
      const statusMap = {
        initial: 'ПЕРВИЧНЫЙ КОНТАКТ',
        negotiation: 'ПЕРЕГОВОРЫ',
        decision: 'ПРИНИМАЮТ РЕШЕНИЕ',
        contract: 'СОГЛАСОВАНИЕ ДОГОВОРА',
        deal: 'СДЕЛКА',
      }
      
      return statusMap[row.original.deal_status as keyof typeof statusMap] || '-'
    },
  },
  {
    accessorKey: 'districts',
    header: 'Район(ы)',
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        {Array.isArray(row.original.district) 
          ? row.original.district.join(', ')
          : row.original.district}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Открыть меню</span>
              <div className="h-4 w-4">⋮</div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Действия</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(row.original.client_name)}
            >
              Копировать имя клиента
            </DropdownMenuItem>
            <DropdownMenuItem>Редактировать</DropdownMenuItem>
            <DropdownMenuItem>Удалить</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface PropertyTableProps {
  data: PropertyFormData[]
}

export function PropertyTable({ data }: PropertyTableProps) {
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

