import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpayInstance = null;

const getRazorpay = () => {
  if (!razorpayInstance && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

/**
 * Create a new Razorpay order
 * @param {number} amount - Amount in INR (will be converted to paise internally)
 * @param {string} currency - Currency code (e.g., 'INR')
 * @param {string} planId - The ID of the plan
 * @returns {Promise<Object>} Order details
 */
export const createOrder = async (amount, currency, planId) => {
  const instance = getRazorpay();
  if (!instance) {
    console.warn('[AI Studio] Razorpay keys not provided in environment; returning simulated demo order.');
    return {
      id: `order_demo_${Date.now()}`,
      amount: amount * 100,
      currency,
      receipt: `receipt_demo_${Date.now()}`,
      notes: { planId },
      status: 'created'
    };
  }

  const options = {
    amount: amount * 100, // amount in the smallest currency unit (paise)
    currency,
    receipt: `receipt_order_${Date.now()}`,
    notes: { planId }
  };

  try {
    const order = await instance.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    throw new Error('Failed to create payment order');
  }
};

/**
 * Verify Razorpay payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {boolean} True if signature is valid
 */
export const verifyPayment = (orderId, paymentId, signature) => {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    // In test/demo mode when Razorpay credentials are not set
    return true;
  }

  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === signature;
};
