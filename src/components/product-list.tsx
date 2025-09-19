// 'use client';

// import type { Product } from '@/lib/types';
// import { useState, useMemo } from 'react';
// import Image from 'next/image';
// import {
//   ChefHat,
//   Croissant,
//   Flame,
//   GlassWater,
//   PlusCircle,
//   RectangleVertical,
//   Ruler,
//   Search,
//   SearchX,
//   Utensils,
// } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
// import { Button } from './ui/button';
// import { ScrollArea } from './ui/scroll-area';

// interface ProductListProps {
//   products: Product[];
//   onAddToOrder: (product: Product) => void;
// }

// const categoryIcons: { [key: string]: React.ReactNode } = {
//   BEBIDA: <GlassWater className="h-5 w-5 mr-2" />,
//   MASSA: <Utensils className="h-5 w-5 mr-2" />,
//   MOLHO: <Flame className="h-5 w-5 mr-2" />,
//   SALGADO: <Croissant className="h-5 w-5 mr-2" />,
//   GOURMET: <ChefHat className="h-5 w-5 mr-2" />,
//   PASTEL: <RectangleVertical className="h-5 w-5 mr-2" />,
//   '21CM': <Ruler className="h-5 w-5 mr-2" />,
//   '25CM': <Ruler className="h-5 w-5 mr-2" />,
//   '30CM': <Ruler className="h-5 w-5 mr-2" />,
// };

// export function ProductList({ products, onAddToOrder }: ProductListProps) {
//   const [searchTerm, setSearchTerm] = useState('');
  
//   const categories = useMemo(() => {
//     const sortedCategories = [...new Set(products.map((p) => p.category))].sort();
//     const preferredOrder = ['PASTEL', '21CM', '25CM', '30CM', 'GOURMET', 'SALGADO', 'BEBIDA'];
//     return sortedCategories.sort((a, b) => {
//         const indexA = preferredOrder.indexOf(a);
//         const indexB = preferredOrder.indexOf(b);
//         if (indexA === -1 && indexB === -1) return a.localeCompare(b);
//         if (indexA === -1) return 1;
//         if (indexB === -1) return -1;
//         return indexA - indexB;
//     });
//   }, [products]);

//   const [activeTab, setActiveTab] = useState(categories[0] || '');

//   const filteredProducts = useMemo(() => {
//     return products.filter(
//       (product) =>
//         (product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           product.code.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//   }, [products, searchTerm]);

//   const formatCurrency = (value: number) => {
//     return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
//   };
  
//   return (
//     <>
//       <Card className="h-full flex flex-col">
//         <CardHeader>
//           <div className="flex gap-4 items-center">
//             <div className="relative flex-grow">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Buscar por nome ou código..."
//                 className="pl-9"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="flex-grow flex flex-col min-h-0">
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col min-h-0">
//             <ScrollArea>
//               <TabsList>
//                 {categories.map((category) => (
//                   <TabsTrigger key={category} value={category} className="flex items-center">
//                     {categoryIcons[category]}
//                     {category}
//                   </TabsTrigger>
//                 ))}
//               </TabsList>
//             </ScrollArea>

//             {categories.map((category) => {
//               const productsInCategory = filteredProducts.filter((p) => p.category === category);
//               return (
//                 <TabsContent key={category} value={category} className="flex-grow mt-4 focus-visible:ring-0 focus-visible:ring-offset-0">
//                   <ScrollArea className="h-[60vh] pr-4">
//                     {productsInCategory.length > 0 ? (
//                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                         {productsInCategory.map((product) => (
//                           <Card key={product.code} className="flex flex-col overflow-hidden">
//                              <CardHeader className="p-0 relative">
//                               <div className="aspect-video w-full relative">
//                                 <Image
//                                   src={product.imageUrl || '/placeholder.svg'}
//                                   alt={product.description}
//                                   fill
//                                   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                                   className="object-cover"
//                                   data-ai-hint="food beverage"
//                                 />
//                               </div>
//                             </CardHeader>
//                             <CardContent className="pt-4 flex-grow">
//                                <p className="font-semibold leading-snug">{product.description}</p>
//                             </CardContent>
//                             <CardFooter className="flex-col items-start p-4 pt-2">
//                                 <p className="font-bold text-lg text-primary">{formatCurrency(product.price)}</p>
//                                 <p className="text-xs text-muted-foreground">Cód: {product.code}</p>
//                                 <Button className="w-full mt-4" variant="outline" onClick={() => onAddToOrder(product)}>
//                                 <PlusCircle className="mr-2 h-4 w-4" /> Adicionar
//                                 </Button>
//                             </CardFooter>
//                           </Card>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground space-y-4">
//                         <SearchX className="h-16 w-16" />
//                         <p className="text-lg font-medium">Nenhum produto encontrado</p>
//                         <p>Tente ajustar sua busca.</p>
//                       </div>
//                     )}
//                   </ScrollArea>
//                 </TabsContent>
//               );
//             })}
//           </Tabs>
//         </CardContent>
//       </Card>
//     </>
//   );
// }

'use client';

import type { Product } from '@/lib/types';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  ChefHat,
  Croissant,
  Flame,
  GlassWater,
  PlusCircle,
  RectangleVertical,
  Ruler,
  Search,
  SearchX,
  Utensils,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface ProductListProps {
  products: Product[];
  onAddToOrder: (product: Product) => void;
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  BEBIDA: <GlassWater className="h-5 w-5 mr-2" />,
  MASSA: <Utensils className="h-5 w-5 mr-2" />,
  MOLHO: <Flame className="h-5 w-5 mr-2" />,
  SALGADO: <Croissant className="h-5 w-5 mr-2" />,
  GOURMET: <ChefHat className="h-5 w-5 mr-2" />,
  PASTEL: <RectangleVertical className="h-5 w-5 mr-2" />,
  '21CM': <Ruler className="h-5 w-5 mr-2" />,
  '25CM': <Ruler className="h-5 w-5 mr-2" />,
  '30CM': <Ruler className="h-5 w-5 mr-2" />,
};

export function ProductList({ products, onAddToOrder }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = useMemo(() => {
    const sortedCategories = [...new Set(products.map((p) => p.category))].sort();
    const preferredOrder = ['PASTEL', '21CM', '25CM', '30CM', 'GOURMET', 'SALGADO', 'BEBIDA'];
    return sortedCategories.sort((a, b) => {
        const indexA = preferredOrder.indexOf(a);
        const indexB = preferredOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
  }, [products]);

  const [activeTab, setActiveTab] = useState(categories[0] || '');

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        (product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex gap-4 items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou código..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col min-h-0">
            <ScrollArea>
              <TabsList>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="flex items-center">
                    {categoryIcons[category]}
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>

            {categories.map((category) => {
              const productsInCategory = filteredProducts.filter((p) => p.category === category);
              return (
                <TabsContent key={category} value={category} className="flex-grow mt-4 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <ScrollArea className="h-[60vh] pr-4">
                    {productsInCategory.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {productsInCategory.map((product) => (
                          <Card key={product.code} className="flex flex-col overflow-hidden">
                             <CardHeader className="p-0 relative">
                              <div className="aspect-video w-full relative">
                                <Image
                                  src={product.imageUrl || '/placeholder.svg'}
                                  alt={product.description}
                                  fill
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  className="object-cover"
                                  data-ai-hint="food beverage"
                                />
                              </div>
                            </CardHeader>
                            <CardContent className="pt-4 flex-grow">
                               <p className="font-semibold leading-snug">{product.description}</p>
                            </CardContent>
                            <CardFooter className="flex-col items-start p-4 pt-2">
                                <p className="font-bold text-lg text-primary">{formatCurrency(product.price)}</p>
                                <p className="text-xs text-muted-foreground">Cód: {product.code}</p>
                                <Button className="w-full mt-4" variant="outline" onClick={() => onAddToOrder(product)}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar
                                </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground space-y-4">
                        <SearchX className="h-16 w-16" />
                        <p className="text-lg font-medium">Nenhum produto encontrado</p>
                        <p>Tente ajustar sua busca.</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}