import { query } from '../config/database.js';

/**
 * Middleware to check if user has enough tokens and report limits
 */
export const checkTokenLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await query(
      `SELECT s.*, p.report_limit 
       FROM subscriptions s 
       JOIN plans p ON s.plan_id = p.id 
       WHERE s.user_id = $1 AND s.status = 'active'
       ORDER BY s.created_at DESC LIMIT 1`,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'No active subscription found. Please upgrade your plan.' });
    }

    const subscription = result.rows[0];

    // Check Tokens
    if (subscription.tokens_limit !== -1 && subscription.tokens_used >= subscription.tokens_limit) {
      return res.status(403).json({ error: 'Token limit exceeded. Please upgrade your plan.' });
    }

    // Check Reports
    if (subscription.report_limit !== -1 && subscription.reports_generated >= subscription.report_limit) {
      return res.status(403).json({ error: 'Report limit exceeded. Please upgrade your plan.' });
    }

    req.subscription = subscription;
    next();
  } catch (error) {
    console.error('Error in tokenMeter middleware:', error);
    res.status(500).json({ error: 'Failed to verify usage limits.' });
  }
};

/**
 * Deduct tokens from user subscription
 * @param {string} subscriptionId - UUID of the subscription
 * @param {number} tokensUsed - Amount to deduct
 */
export const deductTokens = async (subscriptionId, tokensUsed) => {
  try {
    await query(
      `UPDATE subscriptions 
       SET tokens_used = tokens_used + $1,
           reports_generated = reports_generated + 1
       WHERE id = $2`,
      [tokensUsed, subscriptionId]
    );
  } catch (error) {
    console.error('Error deducting tokens:', error);
    throw error;
  }
};
