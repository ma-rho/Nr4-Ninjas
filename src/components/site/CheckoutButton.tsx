'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import type { OnApproveData, CreateOrderData } from '@paypal/paypal-js';
import { useCart } from '@/context/CartContext';

const CheckoutButton = () => {
  const { cart, clearCart } = useCart();
  const [{ isPending }] = usePayPalScriptReducer();

  const createOrder = async (data: CreateOrderData, actions: any) => {
    // 1. Calculate totals accurately
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: 'GBP',
            value: totalAmount,
            breakdown: {
              item_total: {
                currency_code: 'GBP',
                value: totalAmount,
              },
            },
          },
          items: cart.map((item) => ({
            name: item.name,
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: 'GBP',
              value: item.price.toFixed(2),
            },
          })),
        },
      ],
    });
  };

  const onApprove = async (data: OnApproveData, actions: any) => {
    try {
      const details = await actions.order.capture();
      
      // Handle "Instrument Declined" (Common with sandbox cards)
      const errorDetail = details?.details?.[0];
      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
        return actions.restart(); // Recovery: redirects user to try another card
      }

      console.log('Capture result', details);
      alert(`Transaction completed by ${details.payer.name.given_name}`);
      clearCart();
    } catch (err) {
      console.error('Capture Error:', err);
    }
  };

  return (
    <div style={{ minHeight: '150px' }}>
      {isPending && <div className="spinner" />}
      <PayPalButtons
        style={{ 
          layout: 'vertical',
          shape: 'rect',
          color: 'gold',
          label: 'checkout' 
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => {
          console.error("PayPal Button Error:", err);
          // Standard sandbox cards often fail if the billing address 
          // doesn't match the sandbox profile country (UK for GBP).
        }}
      />
    </div>
  );
};

export default CheckoutButton;