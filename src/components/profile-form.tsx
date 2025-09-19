
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAppSettings } from '@/context/app-settings-context';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon, Upload, Trash2, PlusCircle } from 'lucide-react';
import { Separator } from './ui/separator';


const profileFormSchema = z.object({
  password: z.string().optional(),
  avatarUrl: z.string().url('URL inválida').or(z.literal('')).optional(),
  pixKey: z.string().optional(),
  locations: z.array(z.object({ value: z.string().min(1, 'O nome do local não pode estar vazio.') })).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { user, updateUser } = useAuth();
  const { appLogo, setAppLogo } = useAppSettings();
  const { toast } = useToast();
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user?.avatarUrl);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      password: '',
      avatarUrl: user?.avatarUrl || '',
      pixKey: user?.pixKey || '',
      locations: user?.locations?.map(l => ({ value: l })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "locations"
  });

  useEffect(() => {
    if (user) {
        setAvatarPreview(user.avatarUrl);
        form.reset({
            avatarUrl: user.avatarUrl || '',
            pixKey: user.pixKey || '',
            password: '',
            locations: user.locations?.map(l => ({ value: l })) || [],
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
  
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAppLogo(result);
        toast({
          title: 'Logo Atualizado!',
          description: 'O novo logo da aplicação foi salvo.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    if (!user) return;
    
    const updateData: any = {
        avatarUrl: data.avatarUrl,
        pixKey: data.pixKey,
        locations: data.locations ? data.locations.map(l => l.value) : [],
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
        <CardDescription>Atualize suas informações pessoais e configurações do app.</CardDescription>
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
            <div className="space-y-4">
              <FormLabel>Locais de Venda</FormLabel>
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`locations.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder={`Local ${index + 1}`} {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
               <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ value: "" })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Local
              </Button>
              <FormDescription>
                Adicione os locais de venda onde você trabalha.
              </FormDescription>
            </div>
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
            <Separator />
            <div className="space-y-2">
                <FormLabel>Logo do App</FormLabel>
                <div className="relative">
                    <Button asChild variant="outline" className="w-full justify-start text-muted-foreground">
                    <label htmlFor="logo-upload">
                        <Upload className="mr-2" />
                        <span>Alterar logo...</span>
                    </label>
                    </Button>
                    <Input 
                    id="logo-upload"
                    type="file" 
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
                <FormDescription>
                    Faça o upload de um novo logo para a aplicação.
                </FormDescription>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit">Salvar Alterações</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
