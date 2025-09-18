'use client';

import Link from 'next/link';
import { BarChart3, LogOut, Users, UtensilsCrossed } from 'lucide-react';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();

  return (
    <>
      <header className="py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg shadow-md">
            <UtensilsCrossed className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">
              Gerenciador Pema
            </h1>
            <p className="text-muted-foreground">Sistema de Ponto de Venda</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user?.role === 'admin' && (
             <Button asChild>
                <Link href="/users">
                    <Users className="mr-2"/>
                    Gerenciar Usuários
                </Link>
            </Button>
          )}
          <Button asChild>
            <Link href="/reports">
              <BarChart3 className="mr-2" />
              Ver Relatórios
            </Link>
          </Button>
          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2" />
            Sair
          </Button>
        </div>
      </header>
      <Separator className="mb-4" />
      <div className="px-4 sm:px-6 lg:px-8 pt-0">{children}</div>
    </>
  );
}
