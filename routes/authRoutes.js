const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');

const router = express.Router();
const JWT_SECRET = 'your_secret_key';

router.post('/', async (req, res) => {
  const { login, password } = req.body;
  const user = await db.Auth.findOne({ where: { login } });
  if (!user) return res.status(401).json({ message: 'Invalid login' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid password' });

  const token = jwt.sign({ id: user.id, login: user.login }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
