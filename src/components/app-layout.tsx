
'use client';

import Link from 'next/link';
import { BarChart3, LogOut, Users, User as UserIcon, Cog } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ThemeSwitcher } from './theme-switcher';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();

  return (
    <>
      <header className="py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4">
          <svg
              width="60"
              height="60"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-primary"
            >
              <path
                d="M100 20C55.8 20 20 55.8 20 100C20 144.2 55.8 180 100 180C144.2 180 180 144.2 180 100C180 55.8 144.2 20 100 20Z"
                fill="currentColor"
              />
              <path
                d="M100 25C58.6 25 25 58.6 25 100C25 141.4 58.6 175 100 175C141.4 175 175 141.4 175 100C175 58.6 141.4 25 100 25Z"
                fill="#FEF7F3"
              />
              <path
                d="M100 30C61.3 30 30 61.3 30 100C30 138.7 61.3 170 100 170C138.7 170 170 138.7 170 100C170 61.3 138.7 30 100 30Z"
                fill="currentColor"
              />
              <path
                d="M100 40C66.9 40 40 66.9 40 100C40 133.1 66.9 160 100 160C133.1 160 160 133.1 160 100C160 66.9 133.1 40 100 40Z"
                fill="#FEF7F3"
              />
              <path
                d="M129.5 82.2C129.5 82.2 135 88.6 135 96.7C135 104.8 128.1 112.5 120.3 112.5H115.5V129.4C115.5 129.4 115.5 135 109.5 135C103.5 135 103.5 129.4 103.5 129.4V70.6C103.5 70.6 103.5 65 109.5 65C115.5 65 115.5 70.6 115.5 70.6V82.2H120.3C124.6 82.2 129.5 82.2 129.5 82.2Z"
                fill="#E8590C"
              />
              <path
                d="M96.4 129.4V70.6C96.4 70.6 96.4 65 90.5 65C84.5 65 84.5 70.6 84.5 70.6V129.4C84.5 129.4 84.5 135 90.5 135C96.5 135 96.4 129.4 96.4 129.4Z"
                fill="#E8590C"
              />
              <path
                d="M75.2 105.1V70.6C75.2 70.6 75.2 65 69.3 65C63.3 65 63.3 70.6 63.3 70.6V105.1C63.3 111.4 63.9 113.8 69.3 113.8C74.7 113.8 75.2 111.4 75.2 105.1Z"
                fill="#E8590C"
              />
              <path
                d="M136.1 135C140.1 135 140.7 131.7 140.7 129.4V108.9C140.7 103 140.1 100.6 135.3 100.6C130.5 100.6 130.5 104.4 130.5 108.9V129.4C130.5 131.7 132.1 135 136.1 135Z"
                fill="#E8590C"
              />
            </svg>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">
                Gerenciador Pema
                </h1>
                <p className="text-muted-foreground">Sistema de Ponto de Venda</p>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user?.role === 'admin' && (
            <>
              <Button asChild>
                  <Link href="/users">
                      <Users className="mr-2"/>
                      Gerenciar Usuários
                  </Link>
              </Button>
              <ThemeSwitcher />
            </>
          )}
          {user?.role !== 'vendedor' && (
            <Button asChild>
                <Link href="/reports">
                <BarChart3 className="mr-2" />
                Ver Relatórios
                </Link>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatarUrl} alt={user?.username} />
                        <AvatarFallback>
                            <UserIcon />
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                    <Cog className="mr-2" />
                    Editar Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <Separator className="mb-4" />
      <div className="px-4 sm:px-6 lg:px-8 pt-0">{children}</div>
    </>
  );
}
