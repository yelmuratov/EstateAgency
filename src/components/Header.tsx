'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FilterDropdown from './FilterDropdown';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Spinner from '@/components/local-components/spinner'; // Assuming you have a Spinner component

const Header: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const pathname = usePathname();
  const router = useRouter();
  const isAddPropertyPage = pathname === '/add-property';

  const handleAddPropertyClick = () => {
    setIsLoading(true);
    router.push('/add-property');
  };

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
                <Button variant="outline" onClick={handleAddPropertyClick}>
                  <Plus className="mr-2 h-4 w-4" /> Добавить Объект
                </Button>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
        {isFilterOpen && !isAddPropertyPage && <FilterDropdown />}
      </div>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner theme="light" />
        </div>
      )}
    </header>
  );
};

export default Header;
