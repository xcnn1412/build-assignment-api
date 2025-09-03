// Create PostgreSQL Connection Pool here !
import pkg from "pg";
const { Pool } = pkg;

const connectionPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Test connection
connectionPool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

connectionPool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

export default connectionPool;
