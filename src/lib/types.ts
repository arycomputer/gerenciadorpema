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

export type CompletedOrder = {
  id: string;
  date: Date;
  items: OrderItem[];
  total: number;
};

export type User = {
    username: string;
    password?: string;
    role: 'admin' | 'vendedor';
}
