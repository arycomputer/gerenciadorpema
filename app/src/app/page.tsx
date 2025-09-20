
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AuthGuard } from '@/components/auth-guard';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useAppSettings } from '@/context/app-settings-context';

function SplashScreen() {
  const { appLogo } = useAppSettings();
  return (
    <div className="flex justify-center items-center h-screen bg-background animate-pulse">
      <div className="relative w-64 h-48">
        <Image
          src={appLogo}
          alt="Pema Pastel Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}


export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 segundos de splash

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <main>
      <AuthGuard>
        <AppLayout>
          <div className="flex justify-center items-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
            <div className="w-full max-w-4xl">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-3xl">Bem-vindo ao Gerenciador Pema</CardTitle>
                  <CardDescription className="text-lg">
                    Escolha uma das opções abaixo para começar.
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <ShoppingCart className="h-10 w-10 text-primary" />
                    <div>
                      <CardTitle className="text-2xl">Abrir PDV</CardTitle>
                      <CardDescription>
                        Iniciar uma nova sessão de vendas no Ponto de Venda.
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href="/pdv">
                        Acessar o Ponto de Venda
                        <ArrowRight className="ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <BarChart3 className="h-10 w-10 text-primary" />
                    <div>
                      <CardTitle className="text-2xl">Gerenciar Dados</CardTitle>
                      <CardDescription>
                        Visualizar relatórios de vendas e gerenciar usuários.
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                     <Button asChild className="w-full">
                      <Link href="/reports">
                        Ver Relatórios
                        <ArrowRight className="ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </AppLayout>
      </AuthGuard>
    </main>
  );
}
