export const ENDPOINTS = {
  login: "/api/auth/login",
  register: "/api/auth/register",
  verifyEmail: "/api/auth/verify-email",
  resendVerificationMail: "/api/auth/resend-verification-mail",
  menu: "/api/menu",
  cart: "/api/cart",
  order: "/api/resto/order",
  tableOrder: "/api/resto/tables/order",
  verifyPayment: "/api/resto/payment/verify",
  getOrders: "/api/resto/orders",
  getTableBookings: "/api/resto/table/bookings",
  checkTableAvailability: "/api/resto/tables/check",
  // For Admin
  AllFoodOrders: "/api/admin/orders",
  AllTableBookings: "/api/admin/table/bookings",
  getUsers: "/api/admin/users",
  updateMenu: "/api/admin/menu/update",
  uploadImage: "/api/admin/upload/image",
  updateOrderStatus: "/api/admin/order/status"
};
