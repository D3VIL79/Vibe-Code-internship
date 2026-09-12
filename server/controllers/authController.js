import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { PLANS } from '../config/plans.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
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
      \`INSERT INTO subscriptions (user_id, plan_id, tokens_limit, reports_generated)
       VALUES ($1, $2, $3, 0)\`,
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

    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
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
      \`SELECT s.*, p.name as plan_name, p.features 
       FROM subscriptions s 
       JOIN plans p ON s.plan_id = p.id 
       WHERE s.user_id = $1 AND s.status = 'active'
       ORDER BY s.created_at DESC LIMIT 1\`,
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
  // Simplistic mock placeholder for google auth logic
  try {
    const { email, name, google_id, avatar_url } = req.body; // In real life, verify token from Google

    let userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    let user;

    if (userResult.rowCount === 0) {
      // Register
      const dummyHash = await bcrypt.hash(google_id + process.env.JWT_SECRET, 10);
      userResult = await query(
        'INSERT INTO users (email, password_hash, name, google_id, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, avatar_url',
        [email, dummyHash, name, google_id, avatar_url]
      );
      user = userResult.rows[0];

      const freePlan = PLANS.free;
      await query(
        \`INSERT INTO subscriptions (user_id, plan_id, tokens_limit, reports_generated)
         VALUES ($1, $2, $3, 0)\`,
        [user.id, freePlan.id, freePlan.token_limit]
      );
    } else {
      user = userResult.rows[0];
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, avatar_url: user.avatar_url } });
  } catch (error) {
    console.error('Google Auth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
};
