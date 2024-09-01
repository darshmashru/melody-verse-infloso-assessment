import express from 'express';
import { Sequelize, DataTypes, Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import next from 'next';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();
server.use(express.json());

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: { // Optional name field
    type: DataTypes.STRING,
    allowNull: true
  },
  profilePicture: { // Optional profile picture field
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL database');
    await sequelize.sync();
    console.log('Database synced');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

initializeDatabase();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Signup route
server.post('/signup', async (req, res) => {
  try {
    const { username, email, password, confirmPassword, name, profilePicture } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      console.log(username, email, password, confirmPassword, name, profilePicture);
      return res.status(400).json({ message: 'Please provide username, email, password, and confirm password' });
    }

    console.log('req.body', req.body);

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ where: { [Op.or]: [{ username }, { email }] } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      name, // Save optional name
      profilePicture // Save optional profile picture
    });

    const token = generateToken(newUser);

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login route
server.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res.status(400).json({ message: 'Please provide username or email, and password' });
    }

    const user = await User.findOne({
      where: username ? { username } : { email }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Forgot Password route
server.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }

    // Generate a password reset token (you can use JWT or any other method)
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the reset token to the user's email (you would typically use a service like SendGrid, Mailgun, etc.)
    console.log(`Password reset link: http://localhost:3000/reset-password?token=${resetToken}`);

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Forgot Password route
server.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset password", error: error.message });
  }
});

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Protected route example
server.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Access granted to protected route', user: req.user });
});

// Handle Next.js pages
server.all('*', (req, res) => {
  return handle(req, res);
});

app.prepare().then(() => {
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

export default server;