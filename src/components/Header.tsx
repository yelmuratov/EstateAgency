'use client'

import React, { useState } from 'react'
import { Search, Filter, Plus, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FilterDropdown from './FilterDropdown'
import ThemeToggle from './ThemeToggle'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Header: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const pathname = usePathname()
  const isAddPropertyPage = pathname === '/add-property'

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center w-full md:w-auto">
            {isAddPropertyPage ? (
              <Button variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Назад
                </Link>
              </Button>
            ) : (
              <>
                <div className="relative flex-grow md:max-w-md">
                  <Input
                    type="text"
                    placeholder="Поиск"
                    className="pl-10 pr-4 py-2 w-full"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
                <Button
                  variant="default"
                  className="ml-2"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="mr-2 h-4 w-4" /> Фильтр
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            {!isAddPropertyPage && (
              <>
                <span className="text-sm text-muted-foreground">12300 объектов</span>
                <Button variant="outline" asChild>
                  <Link href="/add-property">
                    <Plus className="mr-2 h-4 w-4" /> Добавить Объект
                  </Link>
                </Button>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
        {isFilterOpen && !isAddPropertyPage && <FilterDropdown />}
      </div>
    </header>
  )
}

export default Header

