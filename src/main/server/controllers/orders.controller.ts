import { createOrder } from "@/main/services/application/orderService";
import { Request, Response } from "express";

export async function createOrderController(req: Request, res: Response) {
  try {
    const data = req.body;
    
      const order = await createOrder(data);
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: "Error creando la orden", details: error });
  }
}

// export async function listOrdersController(_req: Request, res: Response) {
//   try {
//     const orders = await listOrders();
//     return res.json(orders);
//   } catch (error) {
//     return res.status(500).json({ error: "Error listando órdenes", details: error });
//   }
// }
