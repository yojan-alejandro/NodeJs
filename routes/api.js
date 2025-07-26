import express from 'express';
import { getDenuncias } from '../controllers/denunciaController.js';
import { getSolicitudes } from '../controllers/solicitudController.js';

const router = express.Router();

router.get('/denuncias', getDenuncias);

router.get('/solicitudes', getSolicitudes);

export default router;

