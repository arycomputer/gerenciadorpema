'use client';

import { useState, useEffect } from 'react';
import type { CompletedOrder } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

const chartConfig = {
  vendas: {
    label: 'Vendas',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function SalesReport() {
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedOrders = localStorage.getItem('completedOrders');
    if (storedOrders) {
      setCompletedOrders(JSON.parse(storedOrders).map((order: any) => ({
        ...order,
        date: new Date(order.date)
      })));
    }
  }, []);

  const salesByDay = completedOrders.reduce((acc, order) => {
    const date = format(order.date, 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += order.total;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(salesByDay)
    .map(([date, total]) => ({
      date,
      vendas: total,
      formattedDate: format(new Date(date), 'dd/MM', { locale: ptBR }),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <>
      <header className="py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg shadow-md">
            <BarChart3 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">
              Relatório de Vendas
            </h1>
            <p className="text-muted-foreground">Análise de performance de vendas</p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2" />
            Voltar ao Terminal
          </Link>
        </Button>
      </header>
      <Separator className="mb-4" />
      <div className="grid grid-cols-1 gap-8 p-4 pt-0 sm:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="formattedDate"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                 <YAxis
                  tickFormatter={(value) => formatCurrency(Number(value))}
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent 
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(_, payload) => {
                       if (payload && payload.length > 0) {
                        return format(new Date(payload[0].payload.date), "PPP", { locale: ptBR });
                       }
                       return "";
                    }}
                  />}
                />
                <Bar dataKey="vendas" fill="var(--color-vendas)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedOrders.slice().reverse().map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {format(order.date, 'Pp', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc pl-4">
                        {order.items.map(item => (
                          <li key={item.product.code}>
                            {item.quantity}x {item.product.description}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(order.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
