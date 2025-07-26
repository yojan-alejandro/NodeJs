import { executeQuery } from '../services/dbService.js';

export const getDenuncias = async (req, res, next) => {
    try {
        const denuncias = await executeQuery('SELECT id_denuncias, tipo_delito, descripcion, ubicacion, fecha_hora, estado FROM Denuncias');

        if (!denuncias || denuncias.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron denuncias"
            });
        }

        res.json({
            success: true,
            data: denuncias,
            count: denuncias.length
        });
    } catch (error) {
        console.error('Error en denunciaController:', error);
        next(error);
    }
};
