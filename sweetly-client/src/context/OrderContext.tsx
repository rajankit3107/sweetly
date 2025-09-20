import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

interface OrderItem {
  sweetId: string;
  sweetName: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  finalAmount: number;
  deliveryDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  paymentMethod: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  orderDate: string;
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderResponse {
  orders: Order[];
  totalOrders: number;
  totalPages: number;
  currentPage: number;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  totalOrders: number;
  totalPages: number;
  currentPage: number;
  fetchOrders: (page?: number) => Promise<void>;
  refreshOrders: () => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/orders/my-orders?page=${page}&limit=10`);
      const data: OrderResponse = response.data.data;

      setOrders(data.orders);
      setTotalOrders(data.totalOrders);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load order history");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    await fetchOrders(currentPage);
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((order) => order._id === orderId);
  };

  // Auto-fetch orders when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchOrders();
    }
  }, []);

  const value: OrderContextType = {
    orders,
    loading,
    error,
    totalOrders,
    totalPages,
    currentPage,
    fetchOrders,
    refreshOrders,
    getOrderById,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};

export default OrderContext;
