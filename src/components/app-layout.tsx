
// 'use client';

// import Link from 'next/link';
// import Image from 'next/image';
// import { BarChart3, LogOut, Users, User as UserIcon, Cog } from 'lucide-react';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
//   } from '@/components/ui/dropdown-menu';
// import { useAuth } from '@/context/auth-context';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
// import { ThemeSwitcher } from './theme-switcher';
// import { useAppSettings } from '@/context/app-settings-context';

// export function AppLayout({ children }: { children: React.ReactNode }) {
//   const { logout, user } = useAuth();
//   const { appLogo } = useAppSettings();

//   return (
//     <>
//       <header className="py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
//         <div className="flex items-center gap-4">
//           <Link href="/" className="flex items-center gap-4">
//             <div className="relative w-32 h-16">
//               <Image
//                 src={appLogo}
//                 alt="Pema Pastel Logo"
//                 fill
//                 className="object-contain"
//                 priority
//               />
//             </div>
//             <div>
//                 <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">
//                 Gerenciador Pema
//                 </h1>
//                 <p className="text-muted-foreground">Sistema de Ponto de Venda</p>
//             </div>
//           </Link>
//         </div>
//         <div className="flex items-center gap-4">
//           {user?.role === 'admin' && (
//             <>
//               <Button asChild>
//                   <Link href="/users">
//                       <Users className="mr-2"/>
//                       Gerenciar Usuários
//                   </Link>
//               </Button>
//               <ThemeSwitcher />
//             </>
//           )}
//           {user?.role !== 'vendedor' && (
//             <Button asChild>
//                 <Link href="/reports">
//                 <BarChart3 className="mr-2" />
//                 Ver Relatórios
//                 </Link>
//             </Button>
//           )}

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="relative h-10 w-10 rounded-full">
//                     <Avatar className="h-10 w-10">
//                         <AvatarImage src={user?.avatarUrl} alt={user?.username} />
//                         <AvatarFallback>
//                             <UserIcon />
//                         </AvatarFallback>
//                     </Avatar>
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-56" align="end" forceMount>
//               <DropdownMenuLabel className="font-normal">
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium leading-none">{user?.username}</p>
//                   <p className="text-xs leading-none text-muted-foreground">
//                     {user?.role}
//                   </p>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem asChild>
//                 <Link href="/profile">
//                     <Cog className="mr-2" />
//                     Editar Perfil
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={logout}>
//                 <LogOut className="mr-2" />
//                 Sair
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </header>
//       <Separator className="mb-4" />
//       <div className="px-4 sm:px-6 lg:px-8 pt-0">{children}</div>
//     </>
//   );
// }


'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BarChart3, LogOut, Users, User as UserIcon, Cog } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ThemeSwitcher } from './theme-switcher';
import { useAppSettings } from '@/context/app-settings-context';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const { appLogo } = useAppSettings();

  return (
    <>
      <header className="py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4">
            <div className="relative w-32 h-16">
              <Image
                src={appLogo}
                alt="Pema Pastel Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">
                Gerenciador Pema
                </h1>
                <p className="text-muted-foreground">Sistema de Ponto de Venda</p>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user?.role === 'admin' && (
            <>
              <Button asChild>
                  <Link href="/users">
                      <Users className="mr-2"/>
                      Gerenciar Usuários
                  </Link>
              </Button>
              <ThemeSwitcher />
            </>
          )}
          {user?.role !== 'vendedor' && (
            <Button asChild>
                <Link href="/reports">
                <BarChart3 className="mr-2" />
                Ver Relatórios
                </Link>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatarUrl} alt={user?.username} />
                        <AvatarFallback>
                            <UserIcon />
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                    <Cog className="mr-2" />
                    Editar Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <Separator className="mb-4" />
      <div className="px-4 sm:px-6 lg:px-8 pt-0">{children}</div>
    </>
  );
}
