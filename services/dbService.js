import { pool } from '../config/db.js';

export const executeQuery = async (sql, params = []) => {
    let connection;

    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(sql, params);
        return rows; 
    } catch (error) {
        console.error('Error en dbService:', error);
        throw new Error(`Database error: ${error.message}`);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

export const closePool = async () => {
    try {
        await pool.end();
        console.log('Pool de conexiones cerrado');
    } catch (error) {
        console.error('Error al cerrar el pool:', error);
        throw error; 
    }
};
