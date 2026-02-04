
export type CategoryName = string;

export interface Category {
  id: string;
  name: CategoryName;
  isActive: boolean;
  productCount: number;
}

export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface BrandingSettings {
  logoUrl: string | null;
  faviconUrl: string | null;
  brandName: string;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'returned' | 'cancelled';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: CategoryName;
  description: string;
  originStory?: string;
  rating?: number;
  reviewsCount?: number;
  reviews?: Review[];
  isActive: boolean;
  stockQuantity: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerWhatsapp: string;
  customerEmail: string;
  total: string;
  status: OrderStatus;
  date: string;
  items: CartItem[];
  trackingNumber?: string;
  shippingCompany?: string;
}
