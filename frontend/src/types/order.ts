export interface IOrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  _id: string;
  user: string;
  orderItems: IOrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
} 