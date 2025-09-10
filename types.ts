
export enum UserRole {
  Admin = 'Admin',
  Cashier = 'Cashier',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  date: string; // ISO string
  cashierId: string;
}

export interface AIInsight {
  insight: string;
  chartData: { name: string; value: number }[] | null;
  chartType: 'bar' | 'pie' | 'line' | null;
}
