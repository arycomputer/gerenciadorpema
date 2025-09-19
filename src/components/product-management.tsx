// 'use client';

// import { useState, useMemo, useEffect } from 'react';
// import Image from 'next/image';
// import type { Product } from '@/lib/types';
// import { products as initialProducts } from '@/lib/products';
// import { useToast } from '@/hooks/use-toast';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//   } from '@/components/ui/alert-dialog';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { EllipsisVertical, Pencil, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
// import { ProductForm } from './product-form';

// const PRODUCTS_STORAGE_KEY = 'pema-products';

// export function ProductManagement() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [isAlertOpen, setIsAlertOpen] = useState(false);
//   const [productToDelete, setProductToDelete] = useState<string | null>(null);
//   const { toast } = useToast();

//   useEffect(() => {
//     try {
//       const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
//       if (storedProducts) {
//         setProducts(JSON.parse(storedProducts));
//       } else {
//         localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
//         setProducts(initialProducts);
//       }
//     } catch (error) {
//         console.error("Failed to parse products from storage", error);
//         localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
//         setProducts(initialProducts);
//     }
//   }, []);

//   const persistProducts = (updatedProducts: Product[]) => {
//     setProducts(updatedProducts);
//     localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
//   };

//   const allCategories = useMemo(() => {
//     const categoriesFromProducts = [...new Set(initialProducts.map(p => p.category))];
//     const categoriesFromCurrent = [...new Set(products.map(p => p.category))];
//     return [...new Set([...categoriesFromProducts, ...categoriesFromCurrent])].sort();
//   }, [products]);

//   const handleAddNew = () => {
//     setEditingProduct(null);
//     setIsFormOpen(true);
//   };

//   const handleEdit = (product: Product) => {
//     setEditingProduct(product);
//     setIsFormOpen(true);
//   };

//   const handleDeleteRequest = (productCode: string) => {
//     setProductToDelete(productCode);
//     setIsAlertOpen(true);
//   };

//   const handleDeleteConfirm = () => {
//     if (productToDelete) {
//       persistProducts(products.filter(p => p.code !== productToDelete));
//       toast({
//         title: 'Produto Excluído!',
//         description: 'O produto foi removido com sucesso.',
//         variant: 'destructive'
//       });
//     }
//     setIsAlertOpen(false);
//     setProductToDelete(null);
//   };
  
//   const handleSaveProduct = (productData: Product) => {
//     const productWithImage = {
//         ...productData,
//         imageUrl: productData.imageUrl || `https://picsum.photos/seed/${productData.code}/400/300`,
//     };

//     const exists = products.some(p => p.code === productWithImage.code);
//     if (exists) {
//         persistProducts(products.map(p => (p.code === productWithImage.code ? productWithImage : p)));
//         toast({ title: 'Produto Atualizado!', description: 'Os dados do produto foram atualizados.' });
//     } else {
//         persistProducts([productWithImage, ...products]);
//         toast({ title: 'Produto Adicionado!', description: 'O novo produto foi criado com sucesso.' });
//     }
//     setIsFormOpen(false);
//   };

//   const formatCurrency = (value: number) => {
//     return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
//   };

//   return (
//     <>
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//             <div>
//                 <CardTitle>Gerenciar Produtos</CardTitle>
//                 <CardDescription>Adicione, edite ou remova produtos do sistema.</CardDescription>
//             </div>
//           <Button onClick={handleAddNew}>
//             <Plus className="mr-2" /> Novo Produto
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-[80px]">Imagem</TableHead>
//                 <TableHead>Descrição</TableHead>
//                 <TableHead>Código</TableHead>
//                 <TableHead>Categoria</TableHead>
//                 <TableHead>Preço</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">Ações</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {products.map((product) => (
//                 <TableRow key={product.code}>
//                    <TableCell>
//                     <div className="relative h-12 w-16 rounded-md overflow-hidden">
//                        <Image
//                          src={product.imageUrl || `https://picsum.photos/seed/${product.code}/400/300`}
//                          alt={product.description}
//                          fill
//                          className="object-cover"
//                          sizes="64px"
//                        />
//                     </div>
//                    </TableCell>
//                   <TableCell className="font-medium">{product.description}</TableCell>
//                   <TableCell>
//                      <Badge variant="secondary">{product.code}</Badge>
//                   </TableCell>
//                   <TableCell>{product.category}</TableCell>
//                   <TableCell>{formatCurrency(product.price)}</TableCell>
//                   <TableCell>
//                     <Badge variant={product.active ? 'default' : 'destructive'} className="gap-1">
//                         {product.active ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
//                         {product.active ? 'Ativo' : 'Inativo'}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon">
//                           <EllipsisVertical className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem onClick={() => handleEdit(product)}>
//                           <Pencil className="mr-2 h-4 w-4" />
//                           Editar
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => handleDeleteRequest(product.code)}
//                           className="text-destructive focus:text-destructive"
//                         >
//                           <Trash2 className="mr-2 h-4 w-4" />
//                           Excluir
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
      
//       <ProductForm 
//         isOpen={isFormOpen}
//         onOpenChange={setIsFormOpen}
//         onSave={handleSaveProduct}
//         product={editingProduct}
//         allCategories={allCategories}
//       />

//       <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
//             <AlertDialogDescription>
//               Esta ação não pode ser desfeita. Isso excluirá permanentemente o produto.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancelar</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDeleteConfirm}>Continuar</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }

'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { products as initialProducts } from '@/lib/products';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EllipsisVertical, Pencil, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { ProductForm } from './product-form';

const PRODUCTS_STORAGE_KEY = 'pema-products';

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
        setProducts(initialProducts);
      }
    } catch (error) {
        console.error("Failed to parse products from storage", error);
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
        setProducts(initialProducts);
    }
  }, []);

  const persistProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
  };

  const allCategories = useMemo(() => {
    const categoriesFromProducts = [...new Set(initialProducts.map(p => p.category))];
    const categoriesFromCurrent = [...new Set(products.map(p => p.category))];
    return [...new Set([...categoriesFromProducts, ...categoriesFromCurrent])].sort();
  }, [products]);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteRequest = (productCode: string) => {
    setProductToDelete(productCode);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      persistProducts(products.filter(p => p.code !== productToDelete));
      toast({
        title: 'Produto Excluído!',
        description: 'O produto foi removido com sucesso.',
        variant: 'destructive'
      });
    }
    setIsAlertOpen(false);
    setProductToDelete(null);
  };
  
  const handleSaveProduct = (productData: Product) => {
    const productWithImage = {
        ...productData,
        imageUrl: productData.imageUrl || `https://picsum.photos/seed/${productData.code}/400/300`,
    };

    const exists = products.some(p => p.code === productWithImage.code);
    if (exists) {
        persistProducts(products.map(p => (p.code === productWithImage.code ? productWithImage : p)));
        toast({ title: 'Produto Atualizado!', description: 'Os dados do produto foram atualizados.' });
    } else {
        persistProducts([productWithImage, ...products]);
        toast({ title: 'Produto Adicionado!', description: 'O novo produto foi criado com sucesso.' });
    }
    setIsFormOpen(false);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Gerenciar Produtos</CardTitle>
                <CardDescription>Adicione, edite ou remova produtos do sistema.</CardDescription>
            </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2" /> Novo Produto
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Imagem</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.code}>
                   <TableCell>
                    <div className="relative h-12 w-16 rounded-md overflow-hidden">
                       <Image
                         src={product.imageUrl || `https://picsum.photos/seed/${product.code}/400/300`}
                         alt={product.description}
                         fill
                         className="object-cover"
                         sizes="64px"
                       />
                    </div>
                   </TableCell>
                  <TableCell className="font-medium">{product.description}</TableCell>
                  <TableCell>
                     <Badge variant="secondary">{product.code}</Badge>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    <Badge variant={product.active ? 'default' : 'destructive'} className="gap-1">
                        {product.active ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {product.active ? 'Ativo' : 'Inativo'}
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
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteRequest(product.code)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <ProductForm 
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveProduct}
        product={editingProduct}
        allCategories={allCategories}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o produto.
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