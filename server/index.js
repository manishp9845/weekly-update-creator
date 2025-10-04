const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./database.js');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Signup endpoint
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.run(sql, [username, hash], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.get(sql, [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    res.json({ message: 'Login successful', userId: user.id });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});