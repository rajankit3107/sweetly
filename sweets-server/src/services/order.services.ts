import { Order, IOrder } from "../models/order.model";
import { Sweet } from "../models/sweets.model";
import { ApiError } from "../utils/apiError";

export class OrderService {
  static async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
    try {
      // Validate that all sweets exist and have sufficient quantity
      for (const item of orderData.items || []) {
        const sweet = await Sweet.findById(item.sweetId);
        if (!sweet) {
          throw new ApiError(400, `Sweet with ID ${item.sweetId} not found`);
        }
        if (sweet.quantity < item.quantity) {
          throw new ApiError(
            400,
            `Insufficient quantity for ${sweet.name}. Available: ${sweet.quantity}`
          );
        }
      }

      // Create the order
      const order = new Order(orderData);
      await order.save();

      // Update sweet quantities
      for (const item of orderData.items || []) {
        await Sweet.findByIdAndUpdate(
          item.sweetId,
          { $inc: { quantity: -item.quantity } },
          { new: true }
        );
      }

      return order;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to create order");
    }
  }

  static async getUserOrders(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    orders: IOrder[];
    totalOrders: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [orders, totalOrders] = await Promise.all([
        Order.find({ userId })
          .sort({ orderDate: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Order.countDocuments({ userId }),
      ]);

      const totalPages = Math.ceil(totalOrders / limit);

      return {
        orders,
        totalOrders,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      throw new ApiError(500, "Failed to fetch user orders");
    }
  }

  static async getOrderById(orderId: string, userId: string): Promise<IOrder> {
    try {
      const order = await Order.findOne({ _id: orderId, userId });
      if (!order) {
        throw new ApiError(404, "Order not found");
      }
      return order;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to fetch order");
    }
  }

  static async updateOrderStatus(
    orderId: string,
    status: string,
    deliveryDate?: Date
  ): Promise<IOrder> {
    try {
      const updateData: any = { status };
      if (deliveryDate) {
        updateData.deliveryDate = deliveryDate;
      }

      const order = await Order.findByIdAndUpdate(orderId, updateData, {
        new: true,
      });

      if (!order) {
        throw new ApiError(404, "Order not found");
      }

      return order;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to update order status");
    }
  }

  static async getAllOrders(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<{
    orders: IOrder[];
    totalOrders: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const filter = status ? { status } : {};

      const [orders, totalOrders] = await Promise.all([
        Order.find(filter)
          .populate("userId", "username")
          .sort({ orderDate: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Order.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalOrders / limit);

      return {
        orders,
        totalOrders,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      throw new ApiError(500, "Failed to fetch orders");
    }
  }
}
