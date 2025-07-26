
import { createPool } from 'mysql2/promise'; 
import dotenv from 'dotenv'; 

dotenv.config();

const poolConfig = {
    host: process.env.DB_HOST,       
    user: process.env.DB_USER,       
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,   
    waitForConnections: true,        
    connectionLimit: 10,             
    queueLimit: 0                    
};

console.log('Configuración de MySQL:', poolConfig);

export const pool = createPool(poolConfig);

pool.getConnection()
    .then(connection => {
        console.log('✅ Conectado a MySQL. Base de datos actual:', connection.config.database);
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error de conexión a MySQL:', err.message);
        process.exit(1); 
    });

pool.query('SELECT DATABASE() AS db')
    .then(([rows]) => {
        console.log('✅ Conectado a la base de datos:', rows[0].db);
    })
    .catch(err => {
        console.error('❌ Error al conectar a la base de datos:', err.message);
        process.exit(1);
    });
