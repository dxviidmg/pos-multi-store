/**
 * Modelos de dominio compartidos.
 * Punto único de verdad para las entidades del negocio.
 */

export type ID = number;

export type UserRole = 'owner' | 'admin' | 'seller';

export interface AuthUser {
  token: string;
  role: UserRole;
  store_id?: ID | null;
  access_blocked?: boolean;
  name?: string;
  [key: string]: unknown;
}

export interface Product {
  id: ID;
  code: string;
  name: string;
  brand?: ID | null;
  department?: ID | null;
  cost?: number | null;
  price?: number | null;
  wholesale_price?: number | null;
  min_wholesale_quantity?: number | null;
  unit?: string;
  image?: string | File | null;
  [key: string]: unknown;
}

export interface StoreProduct {
  id: ID;
  product: Product;
  stock: number;
  available_stock: number;
  reserved_stock: number;
  requires_stock_verification?: boolean;
  [key: string]: unknown;
}

export interface Store {
  id: ID;
  name: string;
  type?: string;
  investment?: number;
  [key: string]: unknown;
}

export interface Client {
  id: ID;
  name: string;
  phone_number?: string;
  discount?: ID | null;
  [key: string]: unknown;
}

export interface Brand {
  id: ID;
  name: string;
  [key: string]: unknown;
}

export interface Department {
  id: ID;
  name: string;
  [key: string]: unknown;
}

export type PaymentMethod = 'EF' | 'TA' | 'TR';

export interface Sale {
  id: ID;
  total: number;
  payment_method: PaymentMethod;
  client?: ID | null;
  created_at?: string;
  [key: string]: unknown;
}
