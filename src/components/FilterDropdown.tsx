import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

const FilterDropdown: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="mt-4">
          Объекты <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Фильтр по типу</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Квартиры</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Аренда</DropdownMenuItem>
            <DropdownMenuItem>Продажа</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Участки</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Аренда</DropdownMenuItem>
            <DropdownMenuItem>Продажа</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Коммерция</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Аренда</DropdownMenuItem>
            <DropdownMenuItem>Продажа</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FilterDropdown

