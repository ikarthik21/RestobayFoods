import restoApiInstance from "../../service/api/api";
import useModalStore from "../../store/use-modal";
import useCartStore from "../../store/use-cart";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
    document.body.appendChild(script);
  });
}

export async function displayRazorpay(navigate) {
  // ✅ Accept navigate as a parameter

  try {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      console.error("Razorpay script failed to load");
      return;
    }

    let order;
    try {
      order = await restoApiInstance.makeOrder();
      if (!order?.orderId || !order?.amount) {
        throw new Error("Invalid order data received");
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: Number(order.amount),
      currency: "INR",
      name: "Restobay Foods",
      description: "Food Order",
      image: "https://restobay.vercel.app/images/logo_icon.png",
      order_id: order.orderId,

      handler: async function (response) {
        try {
          const data = {
            orderCreationId: order.orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature
          };

          const result = await restoApiInstance.verifyPayment(data);
          console.log(result);

          if (result?.status === "success") {
            useModalStore.getState().closeModal();
            useCartStore.getState().refreshCart();
            navigate("/orders");
          }
        } catch (error) {
          console.error("Payment verification failed:", error);
        }
      },
      theme: { color: "#ef5644" }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    paymentObject.on("payment.failed", function (response) {
      console.warn("Payment failed:", response.error.description);
    });
  } catch (error) {
    console.error("Error in displayRazorpay:", error);
  }
}
