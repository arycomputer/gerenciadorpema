'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { Upload } from 'lucide-react';

const formSchema = z.object({
  code: z.string().min(1, 'Código é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  price: z.coerce.number().min(0, 'Preço deve ser positivo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  imageUrl: z.string().optional().or(z.literal('')),
  active: z.boolean(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (product: Product) => void;
  product: Product | null;
  allCategories: string[];
}

export function ProductForm({ isOpen, onOpenChange, onSave, product, allCategories }: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      description: '',
      price: 0,
      category: '',
      imageUrl: '',
      active: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
        if (product) {
        form.reset({
            code: product.code,
            description: product.description,
            price: product.price,
            category: product.category,
            imageUrl: product.imageUrl || '',
            active: product.active,
        });
        if (product.imageUrl) {
            setImagePreview(product.imageUrl);
        } else {
            setImagePreview(null);
        }
        } else {
        form.reset({
            code: '',
            description: '',
            price: 0,
            category: '',
            imageUrl: '',
            active: true,
        });
        setImagePreview(null);
        }
    }
  }, [product, form, isOpen]);

  const onSubmit = (data: ProductFormValues) => {
    onSave(data as Product);
    onOpenChange(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('imageUrl', result, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          <DialogDescription>
            {product ? 'Edite os detalhes do produto.' : 'Preencha os detalhes para um novo produto.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: CQ" {...field} disabled={!!product} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Carne com Queijo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Imagem do Produto</FormLabel>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-md overflow-hidden border">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground text-center">Sem Imagem</span>
                    </div>
                  )}
                </div>
                <FormControl>
                    <div className="relative flex-grow">
                      <Button asChild variant="outline" className="w-full justify-start text-muted-foreground">
                        <label htmlFor="image-upload">
                          <Upload className="mr-2" />
                          <span>Enviar imagem...</span>
                        </label>
                      </Button>
                      <Input 
                        id="image-upload"
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Ativo</FormLabel>
                    <FormDescription>
                      O produto aparecerá no terminal de vendas.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
