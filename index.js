const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/', (req, res) => {
  res.send('Server is running smoothly!');
});

// مسار تسجيل مستخدم جديد
app.post('/api/register', async (req, res) => {
  const { username, password, phone } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password, phone, balance) VALUES ($1, $2, $3, $4) RETURNING id, username, balance',
      [username, password, phone, 0.00]
    );
    res.json({ status: 'success', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
