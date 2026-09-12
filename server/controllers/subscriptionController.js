import { query } from '../config/database.js';
import { PLANS } from '../config/plans.js';
import { createOrder, verifyPayment } from '../services/paymentService.js';

export const getPlans = (req, res) => {
  res.json(Object.values(PLANS).filter(plan => plan.is_active));
};

export const getStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await query(
      \`SELECT s.*, p.name as plan_name, p.features, p.report_limit 
       FROM subscriptions s 
       JOIN plans p ON s.plan_id = p.id 
       WHERE s.user_id = $1 AND s.status = 'active'
       ORDER BY s.created_at DESC LIMIT 1\`,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.json({ status: 'no_active_subscription' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get Subscription Status Error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
};

export const checkout = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = PLANS[planId];
    
    if (!plan || !plan.is_active) {
      return res.status(400).json({ error: 'Invalid or inactive plan' });
    }

    if (plan.price_inr === 0) {
      return res.status(400).json({ error: 'Cannot checkout a free plan this way' });
    }

    const order = await createOrder(plan.price_inr, 'INR', planId);
    res.json(order);
  } catch (error) {
    console.error('Checkout Error:', error);
    res.status(500).json({ error: 'Failed to initialize checkout' });
  }
};

export const verify = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, planId } = req.body;
    const userId = req.user.id;

    const isValid = verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    const plan = PLANS[planId];
    if (!plan) return res.status(400).json({ error: 'Invalid plan' });

    // Mark old subscriptions as inactive
    await query(\`UPDATE subscriptions SET status = 'cancelled' WHERE user_id = $1\`, [userId]);

    // Insert new subscription
    const result = await query(
      \`INSERT INTO subscriptions (user_id, plan_id, status, razorpay_subscription_id, tokens_limit) 
       VALUES ($1, $2, 'active', $3, $4) RETURNING *\`,
      [userId, planId, razorpay_payment_id, plan.token_limit]
    );

    res.json({ message: 'Subscription activated successfully', subscription: result.rows[0] });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    await query(\`UPDATE subscriptions SET status = 'cancelled' WHERE user_id = $1 AND status = 'active'\`, [userId]);
    
    // Revert to free plan
    const freePlan = PLANS.free;
    await query(
      \`INSERT INTO subscriptions (user_id, plan_id, tokens_limit) VALUES ($1, $2, $3)\`,
      [userId, freePlan.id, freePlan.token_limit]
    );

    res.json({ message: 'Subscription cancelled. Reverted to free plan.' });
  } catch (error) {
    console.error('Cancel Subscription Error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};
