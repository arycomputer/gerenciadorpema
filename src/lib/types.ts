export type Product = {
  code: string;
  category: string;
  description: string;
  price: number;
  active: boolean;
  imageUrl?: string;
};

export type OrderItem = {
  product: Product;
  quantity: number;
};
