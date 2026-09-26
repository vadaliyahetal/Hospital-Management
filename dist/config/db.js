"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDbConnected = exports.getDb = void 0;
exports.query = query;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let pool = null;
let isConnected = false;
try {
    pool = promise_1.default.createPool({
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
}
catch (error) {
    isConnected = false;
    console.warn('⚠️ [MySQL Notice] Initialization fallback active.');
}
const getDb = () => pool;
exports.getDb = getDb;
const isDbConnected = () => isConnected;
exports.isDbConnected = isDbConnected;
async function query(sql, params = []) {
    if (pool && isConnected) {
        try {
            const [rows] = await pool.execute(sql, params);
            return rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }
    return [];
}
