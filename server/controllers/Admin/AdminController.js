import { pool } from "../../config/database.js";

class AdminController {
  // Fetch all orders with user details
  async getAllOrders(req, res) {
    try {
      const [rows] = await pool.query(`
        SELECT o.id, o.user_id, o.total_amount, o.status, o.created_at, o.updated_at,
               u.name as user_name, u.phone as phone_number
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `);
      return res.status(200).json({ orders: rows });
    } catch (error) {
      return res
        .status(500)
        .json({ type: "error", message: "Internal Server Error" });
    }
  }

  // Fetch all table bookings with user details
  async getAllTableBookings(req, res) {
    try {
      const [rows] = await pool.query(`
        SELECT tb.table_number, tb.user_id, tb.booking_date, tb.start_time, tb.end_time, tb.status,
               u.name as user_name, u.phone as phone_number
        FROM table_bookings tb
        JOIN users u ON tb.user_id = u.id
        ORDER BY tb.booking_date DESC, tb.start_time DESC
      `);
      return res.status(200).json({ bookings: rows });
    } catch (error) {
      console.error("Error fetching table bookings:", error);
      return res
        .status(500)
        .json({ type: "error", message: "Internal Server Error" });
    }
  }

  // Get all users with admin or staff roles
  getAllUsers = async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT name, email, phone
        FROM users
        WHERE role = 'admin' OR role = 'staff'
      `);
      return res.status(200).json({ users: rows });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res
        .status(500)
        .json({ type: "error", message: "Internal Server Error" });
    }
  };

  // Handle menu actions: ENABLE, DISABLE, DELETE, ADD_ITEM, UPDATE_ITEM
  updateMenu = async (req, res) => {
    const { action, payload } = req.body;

    try {
      switch (action) {
        case "ENABLE":
          await pool.query(
            "UPDATE MENU SET available = 1 WHERE id = ?",
            payload.item_id
          );
          return res
            .status(200)
            .json({ type: "success", message: "Item enabled successfully" });

        case "DISABLE":
          await pool.query(
            "UPDATE MENU SET available = 0 WHERE id = ?",
            payload.item_id
          );
          return res
            .status(200)
            .json({ type: "success", message: "Item disabled successfully" });

        case "DELETE":
          await pool.query("DELETE FROM MENU WHERE id = ?", payload.item_id);
          return res.status(200).json({ message: "Item deleted successfully" });

        case "ADD_ITEM": {
          const { name, description, price, category, imageUrl } = payload;

          if (!name || !description || !price || !category) {
            return res.status(400).json({
              type: "error",
              message: "Please provide all required fields."
            });
          }

          const [existingItem] = await pool.query(
            "SELECT * FROM MENU WHERE name = ?",
            [name]
          );

          if (existingItem.length > 0) {
            return res.status(400).json({
              type: "error",
              message: "Item already exists. Please choose a different name."
            });
          }

          await pool.query(
            "INSERT INTO MENU (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)",
            [name, description, price, category, imageUrl]
          );

          return res.status(200).json({
            type: "success",
            message: "Item added successfully"
          });
        }

        case "UPDATE_ITEM": {
          if (!payload.id) {
            return res.status(400).json({
              type: "error",
              message: "Item ID is required for updates."
            });
          }

          const updateFields = [];
          const queryValues = [];

          if (payload.name) {
            updateFields.push("name = ?");
            queryValues.push(payload.name);
          }
          if (payload.description) {
            updateFields.push("description = ?");
            queryValues.push(payload.description);
          }
          if (payload.price) {
            updateFields.push("price = ?");
            queryValues.push(payload.price);
          }
          if (payload.category) {
            updateFields.push("category = ?");
            queryValues.push(payload.category);
          }
          if (payload.imageUrl) {
            updateFields.push("image_url = ?");
            queryValues.push(payload.imageUrl);
          }

          if (updateFields.length === 0) {
            return res.status(400).json({
              type: "error",
              message: "No fields provided for update."
            });
          }

          queryValues.push(payload.id);
          const queryString = `UPDATE MENU SET ${updateFields.join(
            ", "
          )} WHERE id = ?`;

          await pool.query(queryString, queryValues);

          return res.status(200).json({
            type: "success",
            message: "Item updated successfully"
          });
        }

        default:
          return res.status(400).json({
            type: "error",
            message: "Invalid action."
          });
      }
    } catch (error) {
      console.error("Error updating menu:", error);
      return res.status(500).json({
        type: "error",
        message: "Internal Server Error"
      });
    }
  };

  // Upload image handler
  uploadImage = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      return res.status(200).json({
        success: true,
        imageUrl: imageUrl
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      return res.status(500).json({
        error: "Image upload failed",
        message: error.message
      });
    }
  };
}

const adminController = new AdminController();

export default adminController;
