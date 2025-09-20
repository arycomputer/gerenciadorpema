'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AccountPayable } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EllipsisVertical, Pencil, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const STORAGE_KEY = 'pema-accounts-payable';

const formSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória.'),
  amount: z.coerce.number().positive('O valor deve ser positivo.'),
  dueDate: z.string().min(1, 'Data de vencimento é obrigatória.'),
});

type FormValues = z.infer<typeof formSchema>;

export function AccountsPayableManagement() {
  const [accounts, setAccounts] = useState<AccountPayable[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountPayable | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setAccounts(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to parse accounts from storage", error);
    }
  }, []);

  const persistAccounts = (updatedAccounts: AccountPayable[]) => {
    setAccounts(updatedAccounts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      amount: 0,
      dueDate: '',
    },
  });

  const handleAddNew = () => {
    setEditingAccount(null);
    form.reset({ description: '', amount: 0, dueDate: '' });
    setIsFormOpen(true);
  };

  const handleEdit = (account: AccountPayable) => {
    setEditingAccount(account);
    form.reset({
      description: account.description,
      amount: account.amount,
      dueDate: account.dueDate,
    });
    setIsFormOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    setAccountToDelete(id);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (accountToDelete) {
      persistAccounts(accounts.filter(acc => acc.id !== accountToDelete));
      toast({
        title: 'Conta Excluída!',
        description: 'A conta foi removida com sucesso.',
        variant: 'destructive',
      });
    }
    setIsAlertOpen(false);
    setAccountToDelete(null);
  };
  
  const handleMarkAsPaid = (id: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    persistAccounts(accounts.map(acc => 
      acc.id === id ? { ...acc, status: 'paid', paidDate: today } : acc
    ));
    toast({
      title: 'Conta Paga!',
      description: 'A conta foi marcada como paga.',
    });
  };

  const onSubmit = (data: FormValues) => {
    if (editingAccount) {
      const updatedAccount = { ...editingAccount, ...data };
      persistAccounts(accounts.map(acc => (acc.id === editingAccount.id ? updatedAccount : acc)));
      toast({ title: 'Conta Atualizada!', description: 'Os dados da conta foram atualizados.' });
    } else {
      const newAccount: AccountPayable = {
        id: new Date().toISOString(),
        status: 'pending',
        ...data,
      };
      persistAccounts([newAccount, ...accounts]);
      toast({ title: 'Conta Adicionada!', description: 'A nova conta a pagar foi criada.' });
    }
    setIsFormOpen(false);
  };
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => acc.status === activeTab);
  }, [accounts, activeTab]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Gerenciar Contas a Pagar</CardTitle>
                <CardDescription>Adicione, edite e acompanhe suas contas.</CardDescription>
            </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2" /> Nova Conta
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="paid">Pagas</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
                <AccountsTable accounts={filteredAccounts} formatDate={formatDate} formatCurrency={formatCurrency} handleEdit={handleEdit} handleDeleteRequest={handleDeleteRequest} handleMarkAsPaid={handleMarkAsPaid} />
            </TabsContent>
            <TabsContent value="paid">
                <AccountsTable accounts={filteredAccounts} formatDate={formatDate} formatCurrency={formatCurrency} handleEdit={handleEdit} handleDeleteRequest={handleDeleteRequest} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingAccount ? 'Editar Conta' : 'Nova Conta'}</DialogTitle>
             <DialogDescription>
                {editingAccount ? 'Edite os detalhes da conta.' : 'Preencha os detalhes para uma nova conta a pagar.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Aluguel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0,00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Vencimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a conta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function AccountsTable({ accounts, formatDate, formatCurrency, handleEdit, handleDeleteRequest, handleMarkAsPaid }: {
    accounts: AccountPayable[];
    formatDate: (date?: string) => string;
    formatCurrency: (value: number) => string;
    handleEdit: (account: AccountPayable) => void;
    handleDeleteRequest: (id: string) => void;
    handleMarkAsPaid?: (id: string) => void;
}) {
    const colSpan = handleMarkAsPaid === undefined ? 6 : 5;
    return (
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                {handleMarkAsPaid === undefined && <TableHead>Data Pagamento</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {accounts.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={colSpan} className="h-24 text-center">
                    Nenhuma conta encontrada.
                    </TableCell>
                </TableRow>
            ) : (
                accounts.map((account) => (
                    <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.description}</TableCell>
                    <TableCell>{formatCurrency(account.amount)}</TableCell>
                    <TableCell>{formatDate(account.dueDate)}</TableCell>
                    {handleMarkAsPaid === undefined && <TableCell>{formatDate(account.paidDate)}</TableCell>}
                    <TableCell>
                        <Badge variant={account.status === 'pending' ? 'destructive' : 'default'} className="gap-1">
                            {account.status === 'pending' ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                            {account.status === 'pending' ? 'Pendente' : 'Paga'}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                            <EllipsisVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {handleMarkAsPaid && (
                                <DropdownMenuItem onClick={() => handleMarkAsPaid(account.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Marcar como Paga
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleEdit(account)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                            onClick={() => handleDeleteRequest(account.id)}
                            className="text-destructive focus:text-destructive"
                            >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))
            )}
            </TableBody>
        </Table>
    );
}
