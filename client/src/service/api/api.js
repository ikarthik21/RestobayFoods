import axios from "axios";
import Cookies from "js-cookie";
import { ENDPOINTS } from "../endpoints/API_ENDPOINTS";

const baseURL = import.meta.env.VITE_BACKEND_URL;
const token = Cookies.get("accessToken");

export const restoClient = axios.create({
  baseURL,
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined
  }
});

class RestoService {
  loginUser = async (data) => {
    try {
      const response = await restoClient.post(ENDPOINTS.login, data);
      return response.data;
    } catch (err) {
      return err.response?.data || { message: err.message };
    }
  };

  registerUser = async (data) => {
    try {
      const response = await restoClient.post(ENDPOINTS.register, data);
      return response.data;
    } catch (err) {
      return {
        type: "error",
        message:
          err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again."
      };
    }
  };

  getMenu = async () => {
    try {
      const response = await restoClient.get(ENDPOINTS.menu);
      return response.data;
    } catch (err) {
      return err.response?.data || { message: err.message };
    }
  };

  cart = async (data) => {
    try {
      const response = await restoClient.post(ENDPOINTS.cart, data);

      return response.data;
    } catch (err) {
      return err.response?.data || { message: err.message };
    }
  };

  getCart = async () => {
    try {
      const response = await restoClient.get(ENDPOINTS.cart);
      return response.data;
    } catch (err) {
      return err.response?.data || { message: err.message };
    }
  };

  makeOrder = async () => {
    try {
      const response = await restoClient.post(ENDPOINTS.order);
      return response.data;
    } catch (err) {
      return err.response?.data || { message: err.message };
    }
  };

  makeTableOrder = async (data) => {
    try {
      const response = await restoClient.post(ENDPOINTS.tableOrder, data);
      return response.data;
    } catch (err) {
      return err.response?.data || { message: err.message };
    }
  };

  verifyPayment = async (data) => {
    try {
      const response = await restoClient.post(ENDPOINTS.verifyPayment, data);
      return response.data;
    } catch (err) {
      return err.response?.data || { message: err.message };
    }
  };

  getOrders = async () => {
    try {
      const response = await restoClient.get(ENDPOINTS.getOrders);
      return response.data;
    } catch (err) {
      return err.response?.data || { message: err.message };
    }
  };

  getTableBookings = async () => {
    try {
      const response = await restoClient.get(ENDPOINTS.getTableBookings);
      return response.data;
    } catch (err) {
      return err.response?.data || { message: err.message };
    }
  };

  checkTableAvailability = async (data) => {
    try {
      const response = await restoClient.post(
        ENDPOINTS.checkTableAvailability,
        data
      );
      return response.data;
    } catch (err) {
      return {
        type: "error",
        message:
          err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again."
      };
    }
  };
}

const restoApiInstance = new RestoService();

export default restoApiInstance;
