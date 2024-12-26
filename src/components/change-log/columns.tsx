"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IChangeLog } from "@/types/property"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<IChangeLog>[] = [
  {
    id: "expand",
    header: "",
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => row.toggleExpanded()}
              >
                {row.getIsExpanded() ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Показать подробности</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "operation",
    header: "Операция",
    cell: ({ row }) => {
      const operation = row.getValue("operation") as string
      return (
        <Badge variant={operation === "CREATE" ? "default" : "secondary"}>
          {operation}
        </Badge>
      )
    }
  },
  {
    accessorKey: "table_name",
    header: "Тип объекта",
    cell: ({ row }) => {
      const tableName = row.getValue("table_name") as string
      return (
        <Badge variant="outline" className="capitalize">
          {tableName}
        </Badge>
      )
    }
  },
  {
    accessorKey: "user",
    header: "Пользователь",
  },
  {
    accessorKey: "created_at",
    header: "Создано",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at") as string)
      return new Intl.DateTimeFormat("ru-UZ", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    }
  },
  {
    accessorKey: "updated_at",
    header: "Обновлено",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updated_at") as string)
      return new Intl.DateTimeFormat("ru-UZ", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    }
  },
]

