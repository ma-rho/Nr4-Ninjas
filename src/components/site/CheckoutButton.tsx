'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import type { OnApproveData, CreateOrderData } from '@paypal/paypal-js';
import { useCart } from '@/context/CartContext';

const CheckoutButton = () => {
  const { cart, clearCart } = useCart();

  const createOrder = (data: CreateOrderData, actions: any) => {
    const totalValue = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalValue,
          },
        },
      ],
    });
  };

  const onApprove = (data: OnApproveData, actions: any) => {
    return actions.order.capture().then((details: any) => {
      console.log('Payment approved', details);
      clearCart(); 
    });
  };

  return (
    <PayPalButtons
      style={{ layout: 'vertical' }}
      createOrder={createOrder}
      onApprove={onApprove}
    />
  );
};

export default CheckoutButton;
