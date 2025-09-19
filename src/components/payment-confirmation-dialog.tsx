'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Copy, Check, LoaderCircle, Signal } from 'lucide-react';
import type { PaymentMethod } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { QRCodeSVG } from 'qrcode.react';

interface PaymentConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  orderTotal: number;
  paymentMethod: PaymentMethod;
  onConfirm: (paymentDetails?: { amountGiven: number, change: number}) => void;
  pixKey?: string;
}

export function PaymentConfirmationDialog({
  isOpen,
  onOpenChange,
  orderTotal,
  paymentMethod,
  onConfirm,
  pixKey,
}: PaymentConfirmationDialogProps) {
  const [amountGiven, setAmountGiven] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const change = useMemo(() => {
    const given = parseFloat(amountGiven);
    if (!isNaN(given) && given >= orderTotal) {
      return given - orderTotal;
    }
    return null;
  }, [amountGiven, orderTotal]);
  
  useEffect(() => {
    if (isOpen) {
      setAmountGiven('');
      setIsCopied(false);
      setIsProcessing(paymentMethod === 'cartao');
      
      if (paymentMethod === 'cartao') {
        const timer = setTimeout(() => {
          setIsProcessing(false);
        }, 3000); // Simulate 3 seconds processing time
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, paymentMethod]);

  const handleConfirm = () => {
    if (paymentMethod === 'dinheiro') {
      if (change === null) {
        toast({
          title: "Valor Inválido",
          description: "Por favor, insira um valor pago que seja igual ou maior que o total do pedido.",
          variant: "destructive",
        });
        return;
      }
      onConfirm({ amountGiven: parseFloat(amountGiven), change });
    } else {
      onConfirm();
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  const handleCopyToClipboard = () => {
    if (pixKey) {
        navigator.clipboard.writeText(pixKey);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }
  };

  const renderContent = () => {
    switch (paymentMethod) {
      case 'dinheiro':
        return (
          <div className="space-y-4">
            <p>Insira o valor pago pelo cliente para calcular o troco.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order-total">Total do Pedido</Label>
                <Input id="order-total" value={formatCurrency(orderTotal)} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount-given">Valor Pago</Label>
                <Input
                  id="amount-given"
                  type="number"
                  placeholder="0,00"
                  value={amountGiven}
                  onChange={(e) => setAmountGiven(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            {change !== null && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Troco a ser devolvido</AlertTitle>
                <AlertDescription className="text-xl font-bold">
                  {formatCurrency(change)}
                </AlertDescription>
              </Alert>
            )}
          </div>
        );
      case 'pix':
        return (
            <div className="space-y-4 text-center">
                 <p className="text-lg">Total a pagar: <strong className="text-primary">{formatCurrency(orderTotal)}</strong></p>
                 {pixKey ? (
                    <div className="space-y-4 flex flex-col items-center">
                        <div className="p-4 bg-white rounded-lg">
                            <QRCodeSVG value={pixKey} size={180} />
                        </div>
                        <div className="space-y-2 w-full">
                            <Label>Ou copie a chave PIX:</Label>
                            <div className="flex items-center justify-center gap-2">
                                <Input value={pixKey} readOnly className="text-center" />
                                <Button variant="outline" size="icon" onClick={handleCopyToClipboard}>
                                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                 ) : (
                    <Alert variant="destructive">
                        <AlertTitle>Nenhuma Chave PIX</AlertTitle>
                        <AlertDescription>
                        Nenhuma chave PIX está configurada no perfil do usuário.
                        </AlertDescription>
                    </Alert>
                 )}
                <p className="text-muted-foreground text-sm">Após a confirmação do pagamento, clique em "Confirmar Venda".</p>
            </div>
        );
      case 'cartao':
        return (
            <div className="space-y-6 text-center flex flex-col items-center">
                <p className="text-lg">Total a pagar: <strong className="text-primary">{formatCurrency(orderTotal)}</strong></p>
                <Signal className="h-16 w-16 text-muted-foreground" />
                {isProcessing ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                    <span>Processando pagamento...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-500">
                    <Check className="h-5 w-5" />
                    <span>Pagamento Aprovado!</span>
                  </div>
                )}
                <p className="text-muted-foreground text-sm">
                  {isProcessing ? 'Por favor, aproxime o cartão da maquininha.' : 'Clique em "Confirmar Venda" para finalizar.'}
                </p>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Pagamento</DialogTitle>
          <DialogDescription>
            Confirme os detalhes do pagamento para finalizar a venda.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">{renderContent()}</div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={paymentMethod === 'cartao' && isProcessing}>
            {paymentMethod === 'cartao' && isProcessing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Venda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
