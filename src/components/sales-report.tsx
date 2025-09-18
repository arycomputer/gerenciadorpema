'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, BarChart3, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

const chartConfig = {
  vendas: {
    label: 'Vendas',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function SalesReport() {
  const [allOrders, setAllOrders] = useState<CompletedOrder[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const storedOrders = localStorage.getItem('completedOrders');
    if (storedOrders) {
      setAllOrders(JSON.parse(storedOrders).map((order: any) => ({
        ...order,
        date: new Date(order.date)
      })));
    }
  }, []);

  const filteredOrders = useMemo(() => {
    if (!dateRange || !dateRange.from) {
      return allOrders;
    }
    const toDate = dateRange.to || dateRange.from;
    return allOrders.filter(order => 
      isWithinInterval(order.date, { start: dateRange.from!, end: toDate })
    );
  }, [allOrders, dateRange]);

  const salesByDay = filteredOrders.reduce((acc, order) => {
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
  
  const setThisMonth = () => {
    setDateRange({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) });
  };
  
  const setThisYear = () => {
    setDateRange({ from: startOfYear(new Date()), to: endOfYear(new Date()) });
  };

  const setToday = () => {
    const now = new Date();
    setDateRange({ from: startOfDay(now), to: endOfDay(now) });
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

      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y", { locale: ptBR })} -{" "}
                        {format(dateRange.to, "LLL dd, y", { locale: ptBR })}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y", { locale: ptBR })
                    )
                  ) : (
                    <span>Selecione um período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
            <Button onClick={setToday}>Hoje</Button>
            <Button onClick={setThisMonth}>Este Mês</Button>
            <Button onClick={setThisYear}>Este Ano</Button>
            <Button variant="ghost" onClick={() => setDateRange(undefined)}>Limpar Filtros</Button>
          </CardContent>
        </Card>
      </div>

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
                {filteredOrders.length === 0 ? (
                   <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      Nenhum pedido encontrado para o período selecionado.
                    </TableCell>
                  </TableRow>
                ) : (
                filteredOrders.slice().reverse().map((order) => (
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
                )))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
