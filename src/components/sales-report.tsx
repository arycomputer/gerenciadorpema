
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { CompletedOrder, Product } from '@/lib/types';
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, CreditCard, Landmark, DollarSign, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const chartConfig = {
  vendas: {
    label: 'Vendas',
    color: 'hsl(var(--primary))',
  },
  quantidade: {
    label: 'Quantidade',
    color: 'hsl(var(--accent))',
  }
} satisfies ChartConfig;

const paymentMethodIcons = {
    dinheiro: <DollarSign className="h-4 w-4" />,
    pix: <Landmark className="h-4 w-4" />,
    cartao: <CreditCard className="h-4 w-4" />,
};

const paymentMethodLabels = {
    dinheiro: 'Dinheiro',
    pix: 'PIX',
    cartao: 'Cartão',
};

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
    const from = startOfDay(dateRange.from);
    const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

    return allOrders.filter(order => 
      isWithinInterval(order.date, { start: from, end: to })
    );
  }, [allOrders, dateRange]);

  const salesByDay = useMemo(() => {
    const dailySales = filteredOrders.reduce((acc, order) => {
        const date = format(order.date, 'yyyy-MM-dd');
        if (!acc[date]) {
        acc[date] = 0;
        }
        acc[date] += order.total;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(dailySales)
        .map(([date, total]) => ({
        date,
        vendas: total,
        formattedDate: format(new Date(date), 'dd/MM', { locale: ptBR }),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredOrders]);

  const salesByLocation = useMemo(() => {
    const locationSales = filteredOrders.reduce((acc, order) => {
        const location = order.location || 'N/A';
        if (!acc[location]) {
            acc[location] = 0;
        }
        acc[location] += order.total;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(locationSales)
        .map(([location, total]) => ({
            location,
            vendas: total,
        }))
        .sort((a, b) => b.vendas - a.vendas);
  }, [filteredOrders]);

  const bestSellingProducts = useMemo(() => {
    const productSales: { [code: string]: { product: Product, quantity: number } } = {};

    filteredOrders.forEach(order => {
        order.items.forEach(item => {
            if (productSales[item.product.code]) {
                productSales[item.product.code].quantity += item.quantity;
            } else {
                productSales[item.product.code] = {
                    product: item.product,
                    quantity: item.quantity,
                };
            }
        });
    });

    return Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);
  }, [filteredOrders]);

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
  
  const availableDates = useMemo(() => allOrders.map(order => order.date), [allOrders]);


  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <>
      <div className="mb-6">
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
                   modifiers={{
                    available: availableDates,
                  }}
                  modifiersClassNames={{
                    available: 'bg-primary/20',
                  }}
                  disabled={(date) => !availableDates.some(d => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')) && !isWithinInterval(date, {start: startOfMonth(new Date()), end: endOfMonth(new Date())})}
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

      <div className="grid grid-cols-1 gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Vendas por Dia</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={salesByDay} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
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
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Vendas por Local</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <BarChart data={salesByLocation} layout="vertical" margin={{ left: 10, right: 10 }}>
                            <CartesianGrid horizontal={false} />
                             <XAxis type="number" dataKey="vendas" hide tickFormatter={(value) => formatCurrency(Number(value))}/>
                            <YAxis 
                                type="category" 
                                dataKey="location"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                width={80}
                            />
                            <RechartsTooltip 
                                cursor={{ fill: 'hsl(var(--muted))' }}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))',
                                }}
                                formatter={(value) => formatCurrency(Number(value))}
                            />
                            <Bar dataKey="vendas" name="Vendas" fill="var(--color-vendas)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Produtos Mais Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <BarChart data={bestSellingProducts} layout="vertical" margin={{ left: 50, right: 10 }}>
                            <CartesianGrid horizontal={false} />
                             <XAxis type="number" dataKey="quantity" hide />
                            <YAxis 
                                type="category" 
                                dataKey="product.description"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                width={120}
                                tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                            />
                            <RechartsTooltip 
                                cursor={{ fill: 'hsl(var(--muted))' }}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))',
                                }}
                            />
                            <Bar dataKey="quantity" name="Quantidade" fill="var(--color-quantidade)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                   <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
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
                      <Badge variant="secondary" className="gap-1.5">
                        <MapPin className="h-3 w-3" />
                        {order.location}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc pl-4">
                        {order.items.map(item => (
                          <li key={item.product.code}>
                            {item.quantity}x {item.product.description}
                          </li>
                        ))}
                      </ul>
                       {order.paymentMethod === 'dinheiro' && (
                        <div className="text-xs text-muted-foreground mt-2">
                            <p>Valor Pago: {formatCurrency(order.amountGiven || 0)}</p>
                            <p>Troco: {formatCurrency(order.change || 0)}</p>
                        </div>
                       )}
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className="gap-1.5">
                            {paymentMethodIcons[order.paymentMethod]}
                            {paymentMethodLabels[order.paymentMethod]}
                        </Badge>
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

