import { executeQuery } from '../services/dbService.js';

export const getSolicitudes = async (req, res, next) => {
    try {
        const solicitudes = await executeQuery('SELECT id_solicitudes, tipo_solicitudes, descripcion, fecha_solicitudes, estado, fecha_resolucion FROM Solicitudes');

        if (!solicitudes || solicitudes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron solicitudes"
            });
        }

        res.json({
            success: true,
            data: solicitudes,
            count: solicitudes.length 
        });
    } catch (error) {
        console.error('Error en solicitudController:', error);
        next(error);
    }
};
