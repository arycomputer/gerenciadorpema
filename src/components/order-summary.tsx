'use client';

import type { OrderItem, Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { MinusCircle, PlusCircle, Trash2, Wand2 } from 'lucide-react';
import { Separator } from './ui/separator';
import { Skeleton } from './ui/skeleton';

interface OrderSummaryProps {
  orderItems: OrderItem[];
  onUpdateQuantity: (productCode: string, newQuantity: number) => void;
  onCompleteOrder: () => void;
  suggestedProduct: Product | null;
  suggestionConfidence?: number | null;
  onAddSuggestion: (product: Product) => void;
  isSuggesting: boolean;
}

export function OrderSummary({
  orderItems,
  onUpdateQuantity,
  onCompleteOrder,
  suggestedProduct,
  suggestionConfidence,
  onAddSuggestion,
  isSuggesting,
}: OrderSummaryProps) {
  const total = orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-6 sticky top-8">
      <Card>
        <CardHeader>
          <CardTitle>Pedido Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[40vh] pr-4">
            {orderItems.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Nenhum item no pedido.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orderItems.map(({ product, quantity }) => (
                  <div key={product.code} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.description}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(product.code, quantity - 1)}
                      >
                        {quantity === 1 ? <Trash2 className="h-4 w-4 text-destructive" /> : <MinusCircle className="h-4 w-4" />}
                      </Button>
                      <span className="w-6 text-center">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(product.code, quantity + 1)}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
        {orderItems.length > 0 && (
          <CardFooter className="flex-col items-stretch space-y-4">
            <Separator />
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
            <Button size="lg" className="w-full font-bold text-lg py-6" onClick={onCompleteOrder}>
              Finalizar Venda
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {(isSuggesting || suggestedProduct) && (
        <Card className="bg-secondary/50 border-accent">
          <CardHeader>
            <CardTitle className="flex items-center text-accent">
              <Wand2 className="mr-2" />
              Sugestão Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSuggesting ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : suggestedProduct ? (
              <div>
                <p className="font-semibold">{suggestedProduct.description}</p>
                <p className="text-sm text-muted-foreground">
                  Confiança: {suggestionConfidence ? `${(suggestionConfidence * 100).toFixed(0)}%` : 'N/A'}
                </p>
              </div>
            ) : null}
          </CardContent>
          {suggestedProduct && !isSuggesting && (
             <CardFooter>
              <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => onAddSuggestion(suggestedProduct)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar ao Pedido
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}
