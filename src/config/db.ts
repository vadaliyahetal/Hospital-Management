import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool: mysql.Pool | null = null;
let isConnected = false;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hospital_management_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 3000
  });

  // Test connection asynchronously
  pool.getConnection()
    .then((conn) => {
      isConnected = true;
      console.log('✅ [MySQL Database] Successfully connected to MySQL at ' + (process.env.DB_HOST || 'localhost'));
      conn.release();
    })
    .catch((err) => {
      isConnected = false;
      console.warn('⚠️ [MySQL Notice] Could not connect to local MySQL server (' + err.message + ').');
      console.log('💡 Running with In-Memory Fast Data Store. All APIs will work immediately without configuration!');
    });
} catch (error) {
  isConnected = false;
  console.warn('⚠️ [MySQL Notice] Initialization fallback active.');
}

export const getDb = () => pool;
export const isDbConnected = () => isConnected;

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (pool && isConnected) {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows as T[];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
  return [];
}
