'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ProductList } from './product-list';
import { OrderSummary } from './order-summary';
import { products as initialProducts } from '@/lib/products';
import type { Product, OrderItem, CompletedOrder, PaymentMethod } from '@/lib/types';
import type { SuggestNextProductOutput } from '@/ai/flows/suggest-next-product';
import { getSuggestionAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { PaymentConfirmationDialog } from './payment-confirmation-dialog';
import { LocationSelectionDialog } from './location-selection-dialog';

const PRODUCTS_STORAGE_KEY = 'pema-products';

export default function SalesTerminal() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<string[]>([]);
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
  const [suggestion, setSuggestion] = useState<SuggestNextProductOutput | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [saleDate, setSaleDate] = useState<Date>(new Date());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('dinheiro');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [location, setLocation] = useState<string>('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  
  useEffect(() => {
    if (user?.locations && user.locations.length > 0) {
      if (user.locations.length > 1) {
        setIsLocationModalOpen(true);
      } else {
        setLocation(user.locations[0]);
      }
    }
  }, [user?.locations]);

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
        setProducts(initialProducts);
      }
    } catch (error) {
        console.error("Failed to parse products from storage", error);
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
        setProducts(initialProducts);
    }

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

  const handleInitiateCheckout = () => {
     if (orderItems.length === 0) {
      toast({
        title: 'Pedido Vazio',
        description: 'Adicione itens ao pedido antes de finalizar.',
        variant: 'destructive',
      });
      return;
    }
    if (!location && user?.locations && user.locations.length > 0) {
      toast({
        title: 'Local não selecionado',
        description: 'Por favor, selecione um local para a venda.',
        variant: 'destructive',
      });
      return;
    }
    setIsPaymentDialogOpen(true);
  }

  const completeOrder = (paymentDetails?: { amountGiven: number, change: number}) => {
    const newCompletedOrder: CompletedOrder = {
      id: new Date().toISOString(),
      date: saleDate,
      items: orderItems,
      total: orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      paymentMethod: paymentMethod,
      location: location,
      ...paymentDetails
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
    setSaleDate(new Date());
    setPaymentMethod('dinheiro');

    setIsPaymentDialogOpen(false);

    toast({
      title: 'Venda Finalizada!',
      description: 'O pedido foi registrado com sucesso.',
    });
  };
  
  const handleSaleDateChange = (date: Date | undefined) => {
    if (date) {
      setSaleDate(date);
    }
  };


  const suggestedProduct = useMemo(() => {
    if (!suggestion) return null;
    return products.find(p => p.code === suggestion.suggestedProductCode);
  }, [suggestion, products]);

  const orderTotal = useMemo(() => {
    return orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [orderItems]);
  
  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setIsLocationModalOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <ProductList 
            products={activeProducts}
            onAddToOrder={addToOrder}
          />
        </div>
        <div className="lg:col-span-2">
          <OrderSummary
            orderItems={orderItems}
            onUpdateQuantity={updateQuantity}
            onInitiateCheckout={handleInitiateCheckout}
            suggestedProduct={suggestedProduct}
            suggestionConfidence={suggestion?.confidence}
            onAddSuggestion={addToOrder}
            isSuggesting={isSuggesting}
            saleDate={saleDate}
            onSaleDateChange={handleSaleDateChange}
            currentUser={user}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            location={location}
            onLocationChange={setLocation}
          />
        </div>
      </div>
      <PaymentConfirmationDialog 
        isOpen={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        orderTotal={orderTotal}
        paymentMethod={paymentMethod}
        onConfirm={completeOrder}
        pixKey={user?.pixKey}
      />
      {user?.locations && user.locations.length > 1 && (
         <LocationSelectionDialog
            isOpen={isLocationModalOpen}
            locations={user.locations}
            onSelectLocation={handleLocationSelect}
        />
      )}
    </>
  );
}
