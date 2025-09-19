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

export type PaymentMethod = 'dinheiro' | 'pix' | 'cartao';

export type CompletedOrder = {
  id: string;
  date: Date;
  items: OrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
  amountGiven?: number;
  change?: number;
  location: string;
};

export type UserRole = 'admin' | 'vendedor' | 'gerente';

export type User = {
    username: string;
    password?: string;
    role: UserRole;
    avatarUrl?: string;
    pixKey?: string;
    locations?: string[];
}
