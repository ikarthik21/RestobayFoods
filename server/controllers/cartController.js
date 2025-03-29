import { pool } from "../config/database.js";

class CartController {
  async addToCart(req, res) {
    try {
      const userId = req.userId;
      const { item_id } = req.body;

      // Check if the user has an existing cart
      const [rows] = await pool.query("SELECT * FROM carts WHERE user_id = ?", [
        userId
      ]);

      let existingCart = rows[0];

      if (!existingCart) {
        const [result] = await pool.query(
          "INSERT INTO carts (user_id) VALUES (?)",
          [userId]
        );
        existingCart = { id: result.insertId }; // Get the new cart ID
      }

      // Find if the item already exists in the cart
      const [cartItem] = await pool.query(
        "SELECT * FROM cart_items WHERE cart_id = ? AND item_id = ?",
        [existingCart.id, item_id]
      );

      // Get the price of the item
      const [price_record] = await pool.query(
        "SELECT price FROM menu WHERE id = ?",
        [item_id]
      );

      if (!price_record.length) {
        return res.status(404).json({ message: "Item not found in menu" });
      }

      const price = price_record[0].price;

      if (cartItem.length === 0) {
        await pool.query(
          "INSERT INTO cart_items (cart_id, item_id, quantity, price) VALUES (?, ?, ?, ?)",
          [existingCart.id, item_id, 1, price]
        );
      } else {
        await pool.query(
          "UPDATE cart_items SET quantity = quantity + 1 WHERE cart_id = ? AND item_id = ?",
          [existingCart.id, item_id]
        );
      }
      res.status(200).json({ message: "Item added to cart" });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async removeFromCart(req, res) {
    const userId = req.userId;
    const { item_id } = req.body;

    const [rows] = await pool.query("SELECT * FROM carts WHERE user_id = ?", [
      userId
    ]);

    const existingCart = rows[0];

    if (!existingCart.id) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const [cartItem] = await pool.query(
      "SELECT * FROM cart_items WHERE cart_id = ? AND item_id = ?",
      [existingCart.id, item_id]
    );

    if (cartItem.length == 0) {
      return res.status(400).json({ message: "Item not found in cart" });
    } else {
      await pool.query(
        "UPDATE cart_items SET quantity = quantity - 1 WHERE cart_id = ? AND item_id = ?",
        [existingCart.id, item_id]
      );

      // Remove item if quantity becomes 0
      await pool.query(
        "DELETE FROM cart_items WHERE cart_id = ? AND item_id = ? AND quantity <= 0",
        [existingCart.id, item_id]
      );
    }

    return res.status(200).json({ message: "Cart updated succesfully" });
  }
  async getCart(req, res) {
    try {
      const userId = req.userId;

      // Fetch the user's cart
      const [rows] = await pool.query("SELECT * FROM carts WHERE user_id = ?", [
        userId
      ]);
      const existingCart = rows[0];

      // If the cart does not exist, return an empty cart
      if (!existingCart?.id) {
        return res.status(200).json({ cart: [], totalPrice: 0 });
      }

      // Fetch cart items with product details (name, image_url) and total price
      const [cartItems] = await pool.query(
        `SELECT 
          ci.item_id AS id,  -- Rename item_id as id
          ci.cart_id, 
          ci.quantity, 
          ci.price, 
          ci.created_at, 
          m.name, 
          m.image_url, 
          (ci.quantity * m.price) AS total_price
        FROM cart_items ci
        JOIN menu m ON ci.item_id = m.id
        WHERE ci.cart_id = ?`,
        [existingCart.id]
      );

      // Calculate total price of the entire cart
      const totalPrice = cartItems.reduce(
        (sum, item) => sum + Number(item.total_price),
        0
      );

      res.status(200).json({ cart: cartItems, totalPrice });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

const cartController = new CartController();

export default cartController;
