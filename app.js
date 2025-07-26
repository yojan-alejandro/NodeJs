
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import { closePool } from './services/dbService.js'; 

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;

console.log('Variables de entorno:', {
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD ? '****' : '(vacío)',
}, 'Número de puerto:', PORT);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRouter);

app.use((err, req, res, next) => {
    console.error('Error global:', err); 
    res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

const shutdown = async () => {
    console.log('\n🚨 Recibida señal de apagado...');
    try {
        await closePool();
        server.close(() => {
            console.log('🔴 Servidor y conexiones cerradas');
            process.exit(0); 
        });
    } catch (error) {
        console.error('Error durante el apagado elegante:', error);
        process.exit(1); 
    }
};

process.on('SIGTERM', shutdown); 
process.on('SIGINT', shutdown);  
