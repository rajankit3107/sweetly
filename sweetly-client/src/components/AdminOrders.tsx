import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import Button from "./ui/Button";
import api from "../api/axios";

interface OrderItem {
  sweetId: string;
  sweetName: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  userId: {
    _id: string;
    username: string;
  };
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

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const fetchOrders = async (page: number = 1, status?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (status && status !== "all") {
        params.append("status", status);
      }

      const response = await api.get(`/orders?${params.toString()}`);
      const data: OrderResponse = response.data.data;
      setOrders(data.orders);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      (window as any).appToast?.("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, selectedStatus);
  }, [selectedStatus]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      (window as any).appToast?.(
        "Order status updated successfully",
        "success"
      );
      fetchOrders(currentPage, selectedStatus);
    } catch (error) {
      console.error("Failed to update order status:", error);
      (window as any).appToast?.("Failed to update order status", "error");
    } finally {
      setUpdatingOrder(null);
    }
  };

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

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = [
      "pending",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
    ];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1
      ? statusFlow[currentIndex + 1]
      : null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/60 rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-slate-200 rounded mb-4"></div>
            <div className="h-3 bg-slate-200 rounded w-2/3 mb-4"></div>
            <div className="h-8 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">
            Filter by status:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <Button
          onClick={() => fetchOrders(1, selectedStatus)}
          variant="secondary"
          size="sm"
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-slate-600 mb-2">
            No orders found
          </h3>
          <p className="text-slate-500">
            {selectedStatus === "all"
              ? "No orders have been placed yet"
              : `No orders with status "${selectedStatus}"`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-lg border border-amber-100/50 shadow-soft hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900 mb-1">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-slate-600">
                        Customer: {order.userId.username} •{" "}
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="flex flex-col lg:items-end gap-2">
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
                      <span className="text-xl font-bold text-slate-900">
                        {formatCurrency(order.finalAmount)}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

                    {/* Delivery Details */}
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">
                        Delivery Details
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Name:</strong> {order.deliveryDetails.name}
                        </p>
                        <p>
                          <strong>Phone:</strong> {order.deliveryDetails.phone}
                        </p>
                        <p>
                          <strong>Address:</strong>{" "}
                          {order.deliveryDetails.address}
                        </p>
                        <p>
                          <strong>City:</strong> {order.deliveryDetails.city} -{" "}
                          {order.deliveryDetails.pincode}
                        </p>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">
                        Actions
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
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

                        {order.status !== "delivered" &&
                          order.status !== "cancelled" && (
                            <div className="mt-3">
                              <Button
                                onClick={() => {
                                  const nextStatus = getNextStatus(
                                    order.status
                                  );
                                  if (nextStatus) {
                                    updateOrderStatus(order._id, nextStatus);
                                  }
                                }}
                                disabled={
                                  updatingOrder === order._id ||
                                  !getNextStatus(order.status)
                                }
                                size="sm"
                                className="w-full"
                              >
                                {updatingOrder === order._id
                                  ? "Updating..."
                                  : `Mark as ${getNextStatus(
                                      order.status
                                    )?.replace("_", " ")}`}
                              </Button>
                            </div>
                          )}

                        {order.status === "pending" && (
                          <Button
                            onClick={() =>
                              updateOrderStatus(order._id, "cancelled")
                            }
                            disabled={updatingOrder === order._id}
                            variant="error"
                            size="sm"
                            className="w-full mt-2"
                          >
                            Cancel Order
                          </Button>
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
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            onClick={() => fetchOrders(currentPage - 1, selectedStatus)}
            disabled={currentPage === 1}
            variant="secondary"
            size="sm"
          >
            Previous
          </Button>
          <span className="text-slate-600 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => fetchOrders(currentPage + 1, selectedStatus)}
            disabled={currentPage === totalPages}
            variant="secondary"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
