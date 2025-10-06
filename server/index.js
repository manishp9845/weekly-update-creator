require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const { User, Message } = require('./database.js');

const app = express();

// ✅ Use Render’s dynamic port (fallback to 3001 locally)
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 🟢 ---- API Routes ----

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({ username, password: hash });
    await newUser.save();

    res.status(201).json({ id: newUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    res.json({ message: 'Login successful', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a new message
app.post('/messages', async (req, res) => {
  const { userId, content, tag } = req.body;

  if (!userId || !content || !tag) {
    return res.status(400).json({ error: 'userId, content, and tag are required' });
  }

  try {
    const newMessage = new Message({ userId, content, tag });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

// Get all messages
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .populate('userId', 'username');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a message
app.delete('/messages/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟡 ---- Serve React Build (if full-stack) ----
app.use(express.static(path.join(__dirname, '../build')));

// Fix for Express 5: use "/*" instead of "*"
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// 🟢 ---- Start Server ----
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
