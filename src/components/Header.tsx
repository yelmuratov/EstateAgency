'use client';

import React, { useState } from 'react';
import { Search, Plus, ArrowLeft, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Spinner from '@/components/local-components/spinner'; // Assuming you have a Spinner component
import ThemeToggle from '@/components/ThemeToggle';
import { UserStore } from '@/store/userStore';

const Header: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logoutUser,loading } = UserStore();// Assuming `user` and `logout` exist in your store
  const isAddPropertyPage = pathname === '/add-property';

  const handleAddPropertySelect = (path: string) => {
    if (pathname === path) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
      router.push(path);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    try{
      
      logoutUser(); // Clears user session (from your auth store)

      router.push('/') // Redirect to home page
    }catch(error){
      console.error(error);
    }
  };

  if(loading){
    return <Spinner theme="dark" />;
  }

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Back Button or Search */}
          <div className="flex items-center w-full sm:w-auto">
            {isAddPropertyPage ? (
              <Button variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Назад
                </Link>
              </Button>
            ) : (
              <div className="relative flex-grow sm:max-w-md w-full">
                <Input
                  type="text"
                  placeholder="Поиск"
                  className="pl-10 pr-4 py-2 w-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Right Section: Theme Toggle, Profile Dropdown */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {!isAddPropertyPage && (
              <>
                <span className="text-sm text-muted-foreground hidden md:block">12300 объектов</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" /> Добавить Объект
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-50">
                    <DropdownMenuItem onClick={() => handleAddPropertySelect('/add-apartment')}>
                      Добавить Квартиру
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddPropertySelect('/add-commercial')}>
                      Добавить Коммерческую
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddPropertySelect('/add-land')}>
                      Добавить Участок
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  {/* Display User Name and Phone */}
                  <p className="font-semibold">{user?.full_name || 'Имя пользователя'}</p>
                  <p>{user?.phone || 'Телефон'}</p>
                </div>
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
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
