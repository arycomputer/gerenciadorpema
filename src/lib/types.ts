export type Product = {
  code: string;
  category: string;
  description: string;
  price: number;
  active: boolean;
};

export type OrderItem = {
  product: Product;
  quantity: number;
};
