const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { query } = require('../config/database');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await query(
      `INSERT INTO users (full_name, email, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id, full_name, email, created_at`,
      [fullName.trim(), email.toLowerCase().trim(), passwordHash]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const result = await query(
      'SELECT id, full_name, email, password_hash, avatar_url, title, bio, location, github_url, linkedin_url, portfolio_url, created_at FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        avatarUrl: user.avatar_url,
        title: user.title,
        bio: user.bio,
        location: user.location,
        githubUrl: user.github_url,
        linkedinUrl: user.linkedin_url,
        portfolioUrl: user.portfolio_url,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/profile
const getProfile = async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      fullName: req.user.full_name,
      email: req.user.email,
      avatarUrl: req.user.avatar_url,
      title: req.user.title,
      bio: req.user.bio,
      location: req.user.location,
      githubUrl: req.user.github_url,
      linkedinUrl: req.user.linkedin_url,
      portfolioUrl: req.user.portfolio_url,
      createdAt: req.user.created_at
    }
  });
};

// PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, title, bio, location, githubUrl, linkedinUrl, portfolioUrl } = req.body;

    const result = await query(
      `UPDATE users SET 
        full_name = COALESCE($1, full_name),
        title = COALESCE($2, title),
        bio = COALESCE($3, bio),
        location = COALESCE($4, location),
        github_url = COALESCE($5, github_url),
        linkedin_url = COALESCE($6, linkedin_url),
        portfolio_url = COALESCE($7, portfolio_url),
        updated_at = NOW()
       WHERE id = $8
       RETURNING id, full_name, email, avatar_url, title, bio, location, github_url, linkedin_url, portfolio_url`,
      [fullName, title, bio, location, githubUrl, linkedinUrl, portfolioUrl, req.user.id]
    );

    const user = result.rows[0];
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        avatarUrl: user.avatar_url,
        title: user.title,
        bio: user.bio,
        location: user.location,
        githubUrl: user.github_url,
        linkedinUrl: user.linkedin_url,
        portfolioUrl: user.portfolio_url
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const result = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    
    // Always return success to prevent email enumeration
    if (result.rows.length === 0) {
      return res.json({ message: 'If an account exists with that email, a reset token has been generated.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
      [resetToken, resetExpires, email.toLowerCase()]
    );

    // In production, send email. For now, return token directly.
    res.json({
      message: 'Password reset token generated.',
      resetToken // Remove this in production - send via email instead
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const result = await query(
      'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL, updated_at = NOW() WHERE id = $2',
      [passwordHash, result.rows[0].id]
    );

    res.json({ message: 'Password reset successful.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, updateProfile, forgotPassword, resetPassword };
