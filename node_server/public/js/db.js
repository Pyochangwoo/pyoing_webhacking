const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'pyoing',
  password: '0000',
  database: 'testdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

connection.connect((error) => {
  if (error) {
    console.error('Database connection failed: ' + error.stack);
    return;
  }
  console.log('Connected to database.');
});


async function query(sql, params) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(sql, params);
    return rows;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = {
  query
};
module.exports = connection;