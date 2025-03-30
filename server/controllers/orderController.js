import { pool } from "../config/database.js";
import { razorpayHelper } from "../utils/helpers.js";
import crypto from "crypto";

class OrderController {
  async makeOrder(req, res) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const userId = req.userId;

      // Get the latest cart total & items
      const [cart] = await connection.query(
        `SELECT c.id as cart_id, SUM(ci.price * ci.quantity) AS total
         FROM carts c
         JOIN cart_items ci ON c.id = ci.cart_id
         WHERE c.user_id = ?
         GROUP BY c.id;`,
        [userId]
      );

      if (!cart.length) {
        return res.status(404).json({ message: "Cart not found or empty" });
      }

      const { cart_id, total } = cart[0];

      // Check for existing pending order
      const [existingOrder] = await connection.query(
        `SELECT id, transaction_id, total_amount FROM orders 
         WHERE user_id = ? AND status = 'PAYMENT_PENDING' AND payment_status = 'PENDING' 
         ORDER BY created_at DESC LIMIT 1;`,
        [userId]
      );

      if (existingOrder.length) {
        const { id: orderId, transaction_id, total_amount } = existingOrder[0];

        //  If cart total has changed, update the order amount
        if (total !== total_amount) {
          await connection.query(
            `UPDATE orders SET total_amount = ?, updated_at = NOW() WHERE id = ?;`,
            [total, orderId]
          );
        }

        //   Check for new items in the cart
        const [cartItems] = await connection.query(
          `SELECT item_id, price, quantity FROM cart_items WHERE cart_id = ?;`,
          [cart_id]
        );

        // Fetch already added items from `order_items`
        const [existingOrderItems] = await connection.query(
          `SELECT item_id FROM order_items WHERE order_id = ?;`,
          [orderId]
        );

        const existingItemIds = new Set(
          existingOrderItems.map((item) => item.item_id)
        );

        // Filter only new items that are not already in order_items
        const newItems = cartItems.filter(
          (item) => !existingItemIds.has(item.item_id)
        );

        if (newItems.length) {
          const orderItemsValues = newItems.map((item) => [
            orderId,
            item.item_id,
            item.price,
            item.quantity
          ]);

          await connection.query(
            `INSERT INTO order_items (order_id, item_id, price, quantity) VALUES ?;`,
            [orderItemsValues]
          );
        }

        await connection.commit();

        return res.status(200).json({
          success: true,
          orderId: transaction_id,
          amount: total * 100,
          currency: "INR",
          message: "Existing pending order updated with new items"
        });
      }

      // Create Razorpay order
      const razorpayOrder = await razorpayHelper.orders.create({
        amount: Math.round(Number(total) * 100),
        currency: "INR",
        receipt: `order_rcpt_${userId}_${Date.now()}`
      });

      // Insert order into database with PAYMENT_PENDING status
      const [orderResult] = await connection.query(
        `INSERT INTO orders (
          user_id,
          total_amount,
          status,
          payment_status,
          transaction_id
        ) VALUES (?, ?, ?, ?, ?)`,
        [userId, total, "PAYMENT_PENDING", "PENDING", razorpayOrder.id]
      );

      const orderId = orderResult.insertId;

      // Get cart items and insert into order_items
      const [cartItems] = await connection.query(
        `SELECT item_id, price, quantity FROM cart_items WHERE cart_id = ?`,
        [cart_id]
      );

      // Assuming you have an order_items table
      const orderItemsValues = cartItems.map((item) => [
        orderId,
        item.item_id,
        item.price,
        item.quantity
      ]);

      if (orderItemsValues.length) {
        await connection.query(
          `INSERT INTO order_items (order_id, item_id, price, quantity)
           VALUES ?`,
          [orderItemsValues]
        );
      }

      await connection.commit();

      return res.status(200).json({
        success: true,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      });
    } catch (error) {
      await connection.rollback();
      console.error("Error creating order:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create order",
        error: process.env.NODE_ENV === "production" ? undefined : error.message
      });
    } finally {
      connection.release();
    }
  }

  async verifyPayment(req, res) {
    const connection = await pool.getConnection();
    try {
      const userId = req.userId;
      await connection.beginTransaction();
      const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature
      } = req.body;

      // Verify signature
      const text = orderCreationId + "|" + razorpayPaymentId;
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({
          status: "error",
          message: "Payment verification failed"
        });
      }

      // Update order status
      const [updateResult] = await connection.query(
        `UPDATE orders 
         SET 
           status = 'PROCESSING', 
           payment_status = 'COMPLETED',
           transaction_id = ?,
           payment_completed_at = NOW(),
           updated_at = NOW()
         WHERE transaction_id = ?`,
        [razorpayPaymentId, razorpayOrderId]
      );

      // If no rows were updated, order not found
      if (updateResult.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({
          status: "error",
          message: "Order not found"
        });
      }

      // Fetch the updated order ID
      const [orderRows] = await connection.query(
        "SELECT id FROM orders WHERE transaction_id = ?",
        [razorpayPaymentId]
      );

      if (!orderRows.length) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: "Order not found after update"
        });
      }

      // Delete cart items after successful payment
      await connection.query(
        `DELETE FROM cart_items WHERE cart_id = (
          SELECT id FROM carts WHERE user_id = ?)`,
        [userId]
      );

      const orderId = orderRows[0].id;

      await connection.commit();

      return res.status(200).json({
        status: "success",
        message: "Payment verified successfully",
        orderId: orderId
      });
    } catch (error) {
      await connection.rollback();
      console.error("Error verifying payment:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to verify payment",
        error: process.env.NODE_ENV === "production" ? undefined : error.message
      });
    } finally {
      connection.release();
    }
  }

  /**
   * Handle order cancellation
   */
  async cancelOrder(req, res) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const { orderId } = req.params;
      const userId = req.userId;

      // Check if order exists and belongs to user
      const [orderCheck] = await connection.query(
        `SELECT status, payment_status FROM orders 
         WHERE id = ? AND user_id = ? AND deleted_at IS NULL`,
        [orderId, userId]
      );

      if (!orderCheck.length) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      const { status, payment_status } = orderCheck[0];

      // Check if order can be cancelled
      const cancellableStatuses = ["PENDING", "PAYMENT_PENDING", "PROCESSING"];

      if (!cancellableStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot cancel an order with status: ${status}`
        });
      }

      // Update order status
      await connection.query(
        `UPDATE orders SET status = 'CANCELLED', updated_at = NOW() WHERE id = ?`,
        [orderId]
      );

      // If payment was completed, initiate refund through Razorpay
      if (payment_status === "COMPLETED") {
        // You would implement Razorpay refund logic here
        // For now, just update the status
        await connection.query(
          `UPDATE orders SET payment_status = 'REFUNDED' WHERE id = ?`,
          [orderId]
        );
      }

      await connection.commit();

      return res.status(200).json({
        success: true,
        message: "Order cancelled successfully"
      });
    } catch (error) {
      await connection.rollback();
      console.error("Error cancelling order:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to cancel order",
        error: process.env.NODE_ENV === "production" ? undefined : error.message
      });
    } finally {
      connection.release();
    }
  }

  /**
   * Retrieves order details by ID
   */

  async getOrders(req, res) {
    try {
      const userId = req.userId;

      const [orders] = await pool.query(
        `SELECT 
           o.id, o.user_id, o.total_amount, o.status,
           o.payment_status,
           o.created_at, o.updated_at,
           JSON_ARRAYAGG(
             JSON_OBJECT(
               'id', oi.id,
               'item_id', oi.item_id,
               'name', m.name, -- Get item name from menu table
               'price', oi.price,
               'quantity', oi.quantity
             )
           ) AS items
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         LEFT JOIN menu m ON oi.item_id = m.id -- Join menu table to get item name
         WHERE o.user_id = ? AND o.deleted_at IS NULL
         GROUP BY o.id
         ORDER BY o.created_at DESC`,
        [userId]
      );

      return res.status(200).json({
        success: true,
        orders
      });
    } catch (error) {
      console.error("Error retrieving orders:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve orders",
        error: process.env.NODE_ENV === "production" ? undefined : error.message
      });
    }
  }

  async getOrderById(req, res) {
    try {
      const { orderId } = req.params;
      const userId = req.userId;

      const [orderResults] = await pool.query(
        `SELECT 
           o.id, o.user_id, o.total_amount, o.subtotal,
           o.tax_amount, o.discount_amount, o.status,
           o.payment_status, o.transaction_id,
           o.created_at, o.updated_at, o.payment_completed_at,
           JSON_ARRAYAGG(
             JSON_OBJECT(
               'id', oi.id,
               'product_id', oi.product_id,
               'price', oi.price,
               'quantity', oi.quantity
             )
           ) as items
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         WHERE o.id = ? AND o.user_id = ? AND o.deleted_at IS NULL
         GROUP BY o.id`,
        [orderId, userId]
      );

      if (!orderResults.length) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      return res.status(200).json({
        success: true,
        order: orderResults[0]
      });
    } catch (error) {
      console.error("Error retrieving order:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve order",
        error: process.env.NODE_ENV === "production" ? undefined : error.message
      });
    }
  }
}

const orderController = new OrderController();

export default orderController;
