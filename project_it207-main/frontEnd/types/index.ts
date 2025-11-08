export enum ERole {
  ROLE_USER = "ROLE_USER",
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_MODERATOR = "ROLE_MODERATOR"
}

export interface Role {
  id: number;
  roleName: ERole;
}

export interface Category {
  id: number;
  name: string;
  products?: Product[];
  categoryUrl?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category?: Category;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  roles: Role[];
  orders?: Order[];
  cart?: Cart;
  feedbacks?: Feedback[];
  comments?: Comment[];
  wishlists?: Wishlist[];
  isActive: boolean;
}

export interface Cart {
  id: number;
  user: User;
  items: CartItem[];
}

export interface CartItem {
  id: number;
  cart: Cart;
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  user: User;
  orderDate: string;
  totalAmount: number;
  orderItems: OrderItem[];
  trackingHistory: OrderTracking[];
}

export interface OrderItem {
  id: number;
  order: Order;
  product: Product;
  quantity: number;
  pricePerUnit: number;
}

export interface OrderTracking {
  id: number;
  order: Order;
  status: string;
  timestamp: string;
  location?: string;
}

export interface Feedback {
  id: number;
  user: User;
  rating: number;
  content: string;
  createdAt: string;
}

export interface Comment {
  id: number;
  user: User;
  product: Product;
  content: string;
  createdAt: string;
}

export interface Wishlist {
  id: number;
  user: User;
  product: Product;
}

export interface ChatMessage {
  id: number;
  sender: User;
  receiver: User;
  content: string;
  timestamp: string;
}





