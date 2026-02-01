import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface UseSubscriptionReturn {
  loading: boolean;
  currentSubscription: any;
  fetchCurrentSubscription: () => Promise<void>;
  initiatePayment: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [loading, setLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);

  const fetchCurrentSubscription = useCallback(async () => {
    try {
      const response = await fetch('/api/subscriptions/current', {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        setCurrentSubscription(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    }
  }, []);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = useCallback(async (planId: string) => {
    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway. Please refresh and try again.');
      }

      // Create order
      const orderResponse = await fetch('/api/subscriptions/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ planId }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Get Razorpay key from env
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      
      if (!razorpayKey) {
        throw new Error('Payment configuration error');
      }

      // Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'GreenSentinel',
        description: orderData.data.planName,
        order_id: orderData.data.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/subscriptions/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              toast.success('Subscription activated successfully!');
              fetchCurrentSubscription();
              // Reload to update user state
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error(error instanceof Error ? error.message : 'Payment verification failed');
          }
        },
        prefill: {
          email: '', // Will be filled by user
        },
        theme: {
          color: '#166534',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error);
        toast.error(response.error?.description || 'Payment failed');
        setLoading(false);
      });
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Payment failed');
      setLoading(false);
    }
  }, [fetchCurrentSubscription]);

  const cancelSubscription = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast.success(data.message);
      fetchCurrentSubscription();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  }, [fetchCurrentSubscription]);

  return {
    loading,
    currentSubscription,
    fetchCurrentSubscription,
    initiatePayment,
    cancelSubscription,
  };
}