'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon, Upload } from 'lucide-react';
import { Textarea } from './ui/textarea';


const profileFormSchema = z.object({
  password: z.string().optional(),
  avatarUrl: z.string().url('URL inválida').or(z.literal('')).optional(),
  pixKey: z.string().optional(),
  locations: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user?.avatarUrl);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      password: '',
      avatarUrl: user?.avatarUrl || '',
      pixKey: user?.pixKey || '',
      locations: user?.locations?.join(', ') || '',
    },
  });

  useEffect(() => {
    if (user) {
        setAvatarPreview(user.avatarUrl);
        form.reset({
            avatarUrl: user.avatarUrl || '',
            pixKey: user.pixKey || '',
            password: '',
            locations: user.locations?.join(', ') || '',
        });
    }
  }, [user, form]);
  
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        form.setValue('avatarUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    if (!user) return;
    
    const updateData: any = {
        avatarUrl: data.avatarUrl,
        pixKey: data.pixKey,
        locations: data.locations ? data.locations.split(',').map(l => l.trim()).filter(Boolean) : [],
    };

    if (data.password) {
        updateData.password = data.password;
    }

    try {
      updateUser(user.username, updateData);
      toast({
        title: 'Perfil Atualizado!',
        description: 'Suas informações foram salvas com sucesso.',
      });
      router.push('/');
    } catch (error: any) {
        toast({
            title: 'Erro',
            description: error.message,
            variant: 'destructive',
        })
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Meu Perfil</CardTitle>
        <CardDescription>Atualize suas informações pessoais.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
             <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarPreview} alt={user.username} />
                    <AvatarFallback>
                        <UserIcon className="h-10 w-10" />
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-2 flex-grow">
                    <p className="text-lg font-semibold">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
            </div>
             <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Button asChild variant="outline" className="w-full justify-start text-muted-foreground">
                        <label htmlFor="avatar-upload">
                          <Upload className="mr-2" />
                          <span>{field.value ? 'Alterar imagem...' : 'Enviar imagem...'}</span>
                        </label>
                      </Button>
                      <Input 
                        id="avatar-upload"
                        type="file" 
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pixKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave PIX</FormLabel>
                  <FormControl>
                    <Input placeholder="Sua chave PIX (CPF, e-mail, etc.)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Locais de Venda</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Balcão, Salão, Delivery" {...field} />
                  </FormControl>
                  <FormDescription>
                    Separe os diferentes locais de venda por vírgula.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Deixe em branco para não alterar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit">Salvar Alterações</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
