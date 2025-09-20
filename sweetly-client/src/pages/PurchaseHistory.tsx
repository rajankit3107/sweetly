import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useOrders } from "../context/OrderContext";

declare global {
  interface Window {
    appToast?: (message: string, type: string) => void;
  }
}

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

const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-800",
    icon: "⏳",
    label: "Pending",
  },
  confirmed: {
    color: "bg-blue-100 text-blue-800",
    icon: "✅",
    label: "Confirmed",
  },
  preparing: {
    color: "bg-orange-100 text-orange-800",
    icon: "👨‍🍳",
    label: "Preparing",
  },
  out_for_delivery: {
    color: "bg-purple-100 text-purple-800",
    icon: "🚚",
    label: "Out for Delivery",
  },
  delivered: {
    color: "bg-green-100 text-green-800",
    icon: "🎉",
    label: "Delivered",
  },
  cancelled: {
    color: "bg-red-100 text-red-800",
    icon: "❌",
    label: "Cancelled",
  },
};

const paymentMethodConfig = {
  cod: { icon: "💰", label: "Cash on Delivery" },
  upi: { icon: "📱", label: "UPI Payment" },
  card: { icon: "💳", label: "Credit/Debit Card" },
};

export default function PurchaseHistory() {
  const { orders, loading, error, totalPages, currentPage, fetchOrders } =
    useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    );
  };

  const getPaymentConfig = (method: string) => {
    return (
      paymentMethodConfig[method as keyof typeof paymentMethodConfig] ||
      paymentMethodConfig.cod
    );
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 py-8"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">
              🛍️ Purchase History
            </h1>
            <p className="text-lg text-slate-600">Loading your orders...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-slate-200 rounded mb-4"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 py-8"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">
            🛍️ Purchase History
          </h1>
          <p className="text-lg text-slate-600">
            Track your Diwali sweets orders
          </p>
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-8">🛒</div>
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-6">
              No orders yet
            </h3>
            <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed">
              Start your Diwali celebration by ordering some delicious sweets!
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/80 backdrop-blur-lg border border-amber-100/50 shadow-soft hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl font-semibold text-slate-900 mb-2">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </CardTitle>
                        <p className="text-slate-600">
                          Placed on {formatDate(order.orderDate)}
                        </p>
                      </div>
                      <div className="flex flex-col md:items-end gap-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            getStatusConfig(order.status).color
                          }`}
                        >
                          <span className="mr-2">
                            {getStatusConfig(order.status).icon}
                          </span>
                          {getStatusConfig(order.status).label}
                        </span>
                        <span className="text-2xl font-bold text-slate-900">
                          {formatCurrency(order.finalAmount)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">
                          Order Items
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0"
                            >
                              <div>
                                <span className="font-medium text-slate-900">
                                  {item.sweetName}
                                </span>
                                <span className="text-slate-600 text-sm ml-2">
                                  x{item.quantity}
                                </span>
                              </div>
                              <span className="font-semibold">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">
                          Order Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600">Payment:</span>
                            <span className="flex items-center gap-1">
                              <span>
                                {getPaymentConfig(order.paymentMethod).icon}
                              </span>
                              <span>
                                {getPaymentConfig(order.paymentMethod).label}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600">Delivery to:</span>
                            <span>{order.deliveryDetails.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600">Address:</span>
                            <span className="text-right">
                              {order.deliveryDetails.address},{" "}
                              {order.deliveryDetails.city} -{" "}
                              {order.deliveryDetails.pincode}
                            </span>
                          </div>
                          {order.deliveryDate && (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-600">
                                Delivery Date:
                              </span>
                              <span>{formatDate(order.deliveryDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-4 border-t border-slate-200">
                      <div className="flex justify-between items-center text-sm">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(order.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Delivery Fee:</span>
                        <span>
                          {order.deliveryFee === 0
                            ? "Free"
                            : formatCurrency(order.deliveryFee)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                        <span>Total:</span>
                        <span>{formatCurrency(order.finalAmount)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center items-center gap-4 mt-8"
              >
                <Button
                  onClick={() => fetchOrders(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="secondary"
                  className="px-4 py-2"
                >
                  Previous
                </Button>
                <span className="text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => fetchOrders(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="secondary"
                  className="px-4 py-2"
                >
                  Next
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
