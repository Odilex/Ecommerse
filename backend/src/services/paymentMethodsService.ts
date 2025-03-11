import Order, { IOrder } from '../models/Order';

interface PaymentResult {
  success: boolean;
  error?: string;
  transactionId?: string;
  status?: string;
}

export const initiateMobileMoneyPayment = async (
  order: IOrder,
  phoneNumber: string,
  provider: string
): Promise<PaymentResult> => {
  try {
    // Here you would integrate with your mobile money provider's API
    // This is a placeholder implementation
    console.log(`Initiating ${provider} payment for order ${order._id} from ${phoneNumber}`);

    // Create a pending payment record
    await updateOrderStatus(order._id.toString(), `MM-${Date.now()}`, provider);

    return {
      success: true,
      transactionId: `MM-${Date.now()}`,
      status: 'pending',
    };
  } catch (error) {
    console.error('Mobile money payment error:', error);
    return {
      success: false,
      error: 'Failed to initiate mobile money payment',
    };
  }
};

export const handleMobileMoneyCallback = async (
  provider: string,
  data: any
): Promise<PaymentResult> => {
  try {
    // Here you would handle the callback from your mobile money provider
    // This is a placeholder implementation
    console.log(`Handling ${provider} callback:`, data);

    if (data.status === 'SUCCESSFUL') {
      await updateOrderStatus(data.orderId, data.transactionId, provider);
      return {
        success: true,
        transactionId: data.transactionId,
        status: 'completed',
      };
    }

    return {
      success: false,
      transactionId: data.transactionId,
      status: 'failed',
      error: 'Payment was not successful',
    };
  } catch (error) {
    console.error('Mobile money callback error:', error);
    return {
      success: false,
      error: 'Failed to process mobile money callback',
    };
  }
};

// Helper function to update order status
async function updateOrderStatus(
  orderId: string,
  transactionId: string,
  provider: string
): Promise<void> {
  try {
    await Order.findByIdAndUpdate(orderId, {
      isPaid: true,
      paidAt: new Date(),
      paymentResult: {
        id: transactionId,
        status: 'completed',
        update_time: new Date().toISOString(),
        provider,
      },
      status: 'processing',
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
} 