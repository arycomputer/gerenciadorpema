'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ProductList } from './product-list';
import { OrderSummary } from './order-summary';
import { products as initialProducts } from '@/lib/products';
import type { Product, OrderItem, CompletedOrder } from '@/lib/types';
import type { SuggestNextProductOutput } from '@/ai/flows/suggest-next-product';
import { getSuggestionAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import { BarChart3, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export default function SalesTerminal() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<string[]>([]);
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
  const [suggestion, setSuggestion] = useState<SuggestNextProductOutput | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedOrders = localStorage.getItem('completedOrders');
    if (storedOrders) {
      setCompletedOrders(JSON.parse(storedOrders).map((order: any) => ({
        ...order,
        date: new Date(order.date)
      })));
    }
    const storedHistory = localStorage.getItem('orderHistory');
    if (storedHistory) {
      setOrderHistory(JSON.parse(storedHistory));
    }
  }, []);
  
  const activeProducts = useMemo(() => products.filter((p) => p.active), [products]);

  const fetchSuggestion = useCallback(async () => {
    if (orderItems.length === 0) {
      setSuggestion(null);
      return;
    }
    setIsSuggesting(true);
    const currentOrderCodes = orderItems.map((item) => item.product.code);
    const newSuggestion = await getSuggestionAction(currentOrderCodes, orderHistory);
    setSuggestion(newSuggestion);
    setIsSuggesting(false);
  }, [orderItems, orderHistory]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSuggestion();
    }, 500); // Debounce to avoid too many API calls

    return () => clearTimeout(debounceTimer);
  }, [orderItems, fetchSuggestion]);

  const addToOrder = (product: Product) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.code === product.code);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.code === product.code ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productCode: string, newQuantity: number) => {
    setOrderItems((prevItems) => {
      if (newQuantity <= 0) {
        return prevItems.filter((item) => item.product.code !== productCode);
      }
      return prevItems.map((item) =>
        item.product.code === productCode ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const completeOrder = () => {
    if (orderItems.length === 0) {
      toast({
        title: 'Pedido Vazio',
        description: 'Adicione itens ao pedido antes de finalizar.',
        variant: 'destructive',
      });
      return;
    }

    const newCompletedOrder: CompletedOrder = {
      id: new Date().toISOString(),
      date: new Date(),
      items: orderItems,
      total: orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    };
    
    const updatedCompletedOrders = [...completedOrders, newCompletedOrder];
    setCompletedOrders(updatedCompletedOrders);
    localStorage.setItem('completedOrders', JSON.stringify(updatedCompletedOrders));
    
    const newHistoryItems = orderItems.map((item) => item.product.code);
    const updatedHistory = [...orderHistory, ...newHistoryItems];
    setOrderHistory(updatedHistory);
    localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
    
    setOrderItems([]);
    setSuggestion(null);
    toast({
      title: 'Venda Finalizada!',
      description: 'O pedido foi registrado com sucesso.',
    });
  };

  const handleProductSave = (productToSave: Product) => {
    setProducts(prevProducts => {
      const exists = prevProducts.some(p => p.code === productToSave.code);
      if (exists) {
        return prevProducts.map(p => p.code === productToSave.code ? productToSave : p);
      }
      return [productToSave, ...prevProducts];
    });
     toast({
      title: 'Produto salvo!',
      description: `O produto "${productToSave.description}" foi salvo com sucesso.`,
    });
  };

  const handleProductDelete = (productCode: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.code !== productCode));
     toast({
      title: 'Produto excluído!',
      description: 'O produto foi excluído com sucesso.',
      variant: 'destructive'
    });
  };

  const suggestedProduct = useMemo(() => {
    if (!suggestion) return null;
    return products.find(p => p.code === suggestion.suggestedProductCode);
  }, [suggestion, products]);

  return (
    <>
      <header className="py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className='flex items-center gap-4'>
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
        <Button asChild>
            <Link href="/reports">
                <BarChart3 className="mr-2"/>
                Ver Relatórios
            </Link>
        </Button>
      </header>
      <Separator className="mb-4" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-4 sm:p-6 lg:p-8 pt-0">
        <div className="lg:col-span-3">
          <ProductList 
            products={products}
            onAddToOrder={addToOrder}
            onSaveProduct={handleProductSave}
            onDeleteProduct={handleProductDelete}
          />
        </div>
        <div className="lg:col-span-2">
          <OrderSummary
            orderItems={orderItems}
            onUpdateQuantity={updateQuantity}
            onCompleteOrder={completeOrder}
            suggestedProduct={suggestedProduct}
            suggestionConfidence={suggestion?.confidence}
            onAddSuggestion={addToOrder}
            isSuggesting={isSuggesting}
          />
        </div>
      </div>
    </>
  );
}
