import { Request, Response } from "express";
import { OrderService } from "../services/order.services";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  const orderData = {
    ...req.body,
    userId,
  };

  const order = await OrderService.createOrder(orderData);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

export const getUserOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await OrderService.getUserOrders(userId, page, limit);

    res.json({
      success: true,
      data: result,
    });
  }
);

export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const { orderId } = req.params;
    const order = await OrderService.getOrderById(orderId, userId);

    res.json({
      success: true,
      data: order,
    });
  }
);

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status, deliveryDate } = req.body;

    const order = await OrderService.updateOrderStatus(
      orderId,
      status,
      deliveryDate
    );

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  }
);

export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const result = await OrderService.getAllOrders(page, limit, status);

    res.json({
      success: true,
      data: result,
    });
  }
);
