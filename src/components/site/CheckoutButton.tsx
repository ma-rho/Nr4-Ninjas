'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { useCart } from '@/context/CartContext';

const CheckoutButton = ({ userName, userEmail }: { userName: string, userEmail: string }) => {
  const { cart, clearCart } = useCart();

  // 1. Create Order: Sends cart to Firebase, returns PayPal Order ID
  const createOrder = async () => {
    try {
      const response = await fetch("https://us-central1-nr4-9c722.cloudfunctions.net/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: cart,
          name: userName,
          email: userEmail,
        }),
      });

      const orderData = await response.json();

      if (orderData.id) {
        return orderData.id;
      } else {
        throw new Error(orderData.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Payment Start Error:", error);
      alert("Could not start PayPal checkout. Please try again.");
    }
  };

  // 2. On Approve: Tells Firebase to capture the money after user logs into PayPal
  const onApprove = async (data: any) => {
    try {
      const response = await fetch("https://us-central1-nr4-9c722.cloudfunctions.net/captureOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      });

      const orderData = await response.json();

      if (orderData.status === 'COMPLETED') {
        alert("Transaction successful! Order ID: " + orderData.id);
        clearCart();
        // Redirect to a thank you page here if desired
      } else {
        alert("Transaction failed or is pending. Status: " + orderData.status);
      }
    } catch (error) {
      console.error("Capture Error:", error);
      alert("An error occurred while finalizing your payment.");
    }
  };

  return (
    <div style={{ minHeight: "150px" }}>
      <PayPalButtons
        style={{ layout: "vertical", color: "blue", shape: "rect", label: "checkout" }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => console.error("PayPal Button Error:", err)}
      />
    </div>
  );
};

export default CheckoutButton;