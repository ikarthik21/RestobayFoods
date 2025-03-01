import { pool } from "../config/database.js";

class MenuController {
  async getMenu(req, res) {
    const [menu] = await pool.query("SELECT * FROM menu");
    res.status(200).json({
      status: "success",
      data: menu
    });
  }
}

const menuController = new MenuController();

export default menuController;
