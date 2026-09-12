import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, DEMO_USERS, dbFallbackStore } from '../config/database.js';
import { PLANS } from '../config/plans.js';

const getJwtSecret = () => process.env.JWT_SECRET || 'salesiq-dev-jwt-secret-key-2025';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user exists
    const userExists = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rowCount > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const userResult = await query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, avatar_url',
      [email, passwordHash, name]
    );
    const user = userResult.rows[0];

    // Create free subscription
    const freePlan = PLANS.free;
    await query(
      `INSERT INTO subscriptions (user_id, plan_id, tokens_limit, reports_generated)
       VALUES ($1, $2, $3, 0)`,
      [user.id, freePlan.id, freePlan.token_limit]
    );

    const token = generateToken(user);

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let result = await query('SELECT * FROM users WHERE email = $1', [email]);
    
    // If not found in store, create the user on the fly so login always works seamlessly
    if (result.rowCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password || 'password123', salt);
      const name = email.split('@')[0] || 'Sales User';
      
      const userResult = await query(
        'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, avatar_url',
        [email, passwordHash, name]
      );
      const newUser = userResult.rows[0];

      const freePlan = PLANS.free;
      await query(
        `INSERT INTO subscriptions (user_id, plan_id, status, tokens_limit, reports_generated)
         VALUES ($1, $2, 'active', $3, 0)`,
        [newUser.id, freePlan.id, freePlan.token_limit]
      );

      const token = generateToken(newUser);
      return res.json({ token, user: newUser });
    }

    const user = result.rows[0];

    // Verify password if provided; if demo password or mock mode, allow login
    if (password && user.password_hash) {
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword && password !== 'password123') {
        return res.status(401).json({ error: 'Invalid credentials. Use password123 or 1-click login.' });
      }
    }

    const token = generateToken(user);
    
    // Omit password from response
    const { password_hash, ...userWithoutPassword } = user;
    
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getMe = async (req, res) => {
  try {
    const userResult = await query('SELECT id, email, name, avatar_url FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const subResult = await query(
      `SELECT s.*, p.name as plan_name, p.features 
       FROM subscriptions s 
       JOIN plans p ON s.plan_id = p.id 
       WHERE s.user_id = $1 AND s.status = 'active'
       ORDER BY s.created_at DESC LIMIT 1`,
      [req.user.id]
    );

    res.json({
      user: userResult.rows[0],
      subscription: subResult.rows[0] || null
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

export const googleAuth = async (req, res) => {
  try {
    let { email, name, google_id, avatar_url, credential } = req.body;

    // Handle Google Identity Services (GSI) One-Tap / JWT credential token
    if (credential && !email) {
      try {
        const parts = credential.split('.');
        if (parts.length >= 2) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          if (payload.email) email = payload.email;
          if (payload.name) name = payload.name;
          if (payload.picture) avatar_url = payload.picture;
          if (payload.sub) google_id = payload.sub;
        }
      } catch (e) {
        console.warn('Could not parse Google credential payload:', e);
      }
    }

    if (!email) {
      return res.status(400).json({ error: 'Google email is required' });
    }

    const finalName = name || email.split('@')[0];
    const finalAvatar = avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
    const finalGoogleId = google_id || `google_${Date.now()}`;

    let userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    let user;

    if (userResult.rowCount === 0) {
      // Register new user authenticated via Google
      const dummyHash = await bcrypt.hash(finalGoogleId + getJwtSecret(), 10);
      userResult = await query(
        'INSERT INTO users (email, password_hash, name, google_id, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, avatar_url',
        [email, dummyHash, finalName, finalGoogleId, finalAvatar]
      );
      user = userResult.rows[0];

      const freePlan = PLANS.free;
      await query(
        `INSERT INTO subscriptions (user_id, plan_id, status, tokens_limit, reports_generated)
         VALUES ($1, $2, 'active', $3, 0)`,
        [user.id, freePlan.id, freePlan.token_limit]
      );
    } else {
      user = userResult.rows[0];
      // Update avatar or name if missing
      if (avatar_url || name) {
        await query(
          'UPDATE users SET name = COALESCE($1, name), avatar_url = COALESCE($2, avatar_url) WHERE id = $3',
          [name || null, avatar_url || null, user.id]
        );
      }
      
      // Ensure user has an active subscription
      const subCheck = await query('SELECT * FROM subscriptions WHERE user_id = $1', [user.id]);
      if (subCheck.rowCount === 0) {
        const freePlan = PLANS.free;
        await query(
          `INSERT INTO subscriptions (user_id, plan_id, status, tokens_limit, reports_generated)
           VALUES ($1, $2, 'active', $3, 0)`,
          [user.id, freePlan.id, freePlan.token_limit]
        );
      }
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url || finalAvatar
      }
    });
  } catch (error) {
    console.error('Google Auth error:', error);
    res.status(500).json({ error: 'Google authentication failed. Please try again.' });
  }
};

/**
 * Return all demo subscriber personas with their profile & subscription details
 */
export const getDemoProfiles = async (req, res) => {
  try {
    const profiles = Object.entries(DEMO_USERS).map(([key, u]) => {
      const plan = PLANS[u.plan_id] || PLANS.free;
      return {
        key,
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        plan_id: u.plan_id,
        plan_name: plan.name,
        description: u.description,
        avatar_url: u.avatar_url,
        tokens_used: u.tokens_used,
        tokens_limit: u.tokens_limit,
        reports_generated: u.reports_generated,
        features: plan.features
      };
    });

    res.json({ profiles });
  } catch (error) {
    console.error('getDemoProfiles error:', error);
    res.status(500).json({ error: 'Failed to retrieve demo profiles' });
  }
};

/**
 * Direct 1-Click login as a specific subscriber profile
 */
export const demoLogin = async (req, res) => {
  try {
    const { subscriberType, email } = req.body;

    let targetUser = null;
    if (subscriberType && DEMO_USERS[subscriberType.toLowerCase()]) {
      targetUser = DEMO_USERS[subscriberType.toLowerCase()];
    } else if (email) {
      targetUser = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!targetUser) {
      // Default to trial user
      targetUser = DEMO_USERS.trial;
    }

    // Find in database
    const userResult = await query('SELECT * FROM users WHERE email = $1', [targetUser.email]);
    let user;
    if (userResult.rowCount > 0) {
      user = userResult.rows[0];
    } else {
      user = {
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name,
        avatar_url: targetUser.avatar_url
      };
    }

    const token = generateToken(user);

    // Fetch subscription
    const subResult = await query(
      `SELECT s.*, p.name as plan_name, p.features 
       FROM subscriptions s 
       JOIN plans p ON s.plan_id = p.id 
       WHERE s.user_id = $1 AND s.status = 'active'
       ORDER BY s.created_at DESC LIMIT 1`,
      [user.id]
    );

    const subscription = subResult.rows[0] || {
      plan_id: targetUser.plan_id,
      plan_name: PLANS[targetUser.plan_id]?.name || 'Always Free',
      tokens_used: targetUser.tokens_used,
      tokens_limit: targetUser.tokens_limit,
      reports_generated: targetUser.reports_generated,
      features: PLANS[targetUser.plan_id]?.features || {}
    };

    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      token,
      user: userWithoutPassword,
      subscription,
      message: `Signed in as ${targetUser.name} (${subscription.plan_name})`
    });
  } catch (error) {
    console.error('demoLogin error:', error);
    res.status(500).json({ error: 'Demo login failed' });
  }
};

