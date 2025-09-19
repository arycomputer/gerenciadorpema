'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface LocationSelectionDialogProps {
  isOpen: boolean;
  locations: string[];
  onSelectLocation: (location: string) => void;
}

export function LocationSelectionDialog({
  isOpen,
  locations,
  onSelectLocation,
}: LocationSelectionDialogProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle>Selecionar Local da Venda</DialogTitle>
          <DialogDescription>
            Escolha o local onde esta venda está sendo realizada.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {locations.map((location) => (
                <Button 
                    key={location}
                    variant="outline"
                    className="h-20 text-lg"
                    onClick={() => onSelectLocation(location)}
                >
                    <MapPin className="mr-2 h-5 w-5" />
                    {location}
                </Button>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
