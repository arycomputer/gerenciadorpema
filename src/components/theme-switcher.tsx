
'use client';

import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from '@/context/theme-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('padrão')}>
          Padrão
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('floresta')}>
          Floresta
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('oceano')}>
          Oceano
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
