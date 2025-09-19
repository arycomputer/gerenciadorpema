
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert, Info } from 'lucide-react';
import { useAppSettings } from '@/context/app-settings-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, users } = useAuth();
  const { appLogo } = useAppSettings();

  const [isRecoverOpen, setIsRecoverOpen] = useState(false);
  const [recoverUsername, setRecoverUsername] = useState('');
  const [recoveredPassword, setRecoveredPassword] = useState<string | null>(null);
  const [recoverError, setRecoverError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (success) {
      router.replace('/');
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };
  
  const handleRecoverPassword = () => {
    setRecoverError('');
    setRecoveredPassword(null);
    const user = users.find(u => u.username === recoverUsername);
    if (user && user.password) {
      setRecoveredPassword(user.password);
    } else {
      setRecoverError('Usuário não encontrado.');
    }
  };

  const openRecoverDialog = () => {
    setRecoverUsername('');
    setRecoveredPassword(null);
    setRecoverError('');
    setIsRecoverOpen(true);
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="relative w-48 h-28 mx-auto mb-4">
              <Image
                  src={appLogo}
                  alt="Pema Pastel Logo"
                  fill
                  className="object-contain"
                  priority
              />
            </div>
            <CardTitle className="text-2xl">Bem-vindo ao Gerenciador Pema</CardTitle>
            <CardDescription>Faça login para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Button variant="link" type="button" onClick={openRecoverDialog} className="h-auto p-0 text-xs">
                        Esqueceu a senha?
                    </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
               {error && (
                <Alert variant="destructive">
                  <TriangleAlert className="h-4 w-4" />
                  <AlertTitle>Erro de Autenticação</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-xs text-muted-foreground justify-center">
              <p>Usuário: admin | Senha: admin</p>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={isRecoverOpen} onOpenChange={setIsRecoverOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recuperar Senha</DialogTitle>
            <DialogDescription>
              Digite seu nome de usuário para ver sua senha.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recover-username">Nome de Usuário</Label>
              <Input
                id="recover-username"
                value={recoverUsername}
                onChange={(e) => setRecoverUsername(e.target.value)}
                placeholder="ex: joao.silva"
              />
            </div>
            {recoverError && (
              <Alert variant="destructive">
                <TriangleAlert className="h-4 w-4" />
                <AlertDescription>{recoverError}</AlertDescription>
              </Alert>
            )}
            {recoveredPassword && (
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Sua senha é:</AlertTitle>
                    <AlertDescription className="text-lg font-bold">
                        {recoveredPassword}
                    </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsRecoverOpen(false)}>
              Fechar
            </Button>
            <Button type="button" onClick={handleRecoverPassword}>
              Recuperar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
