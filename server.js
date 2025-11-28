
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();

const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'afundamentos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get('/', (req, res) => {
  res.send('API readyyy');
});

app.get('/grupos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre FROM grupos');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener grupos:', error);
    res.status(500).json({ error: 'Error al obtener grupos' });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.id,
        u.nombre,
        u.password,
        u.edad,
        u.id_grupo,
        g.nombre AS grupo_nombre
      FROM usuarios u
      LEFT JOIN grupos g ON u.id_grupo = g.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.get('/usuarios/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const [rows] = await pool.query(
      `
      SELECT 
        u.id,
        u.nombre,
        u.password,
        u.edad,
        u.id_grupo,
        g.nombre AS grupo_nombre
      FROM usuarios u
      LEFT JOIN grupos g ON u.id_grupo = g.id
      WHERE u.id = ?
      `,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor levantado puerto ${PORT}`);
});
