const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/', publicController.inicio);
router.get('/noticias', publicController.noticias);
router.get('/noticias/buscar', publicController.buscarNoticias);
router.get('/noticias/:id', publicController.detalleNoticia);
router.get('/eventos', publicController.eventos);
router.get('/eventos/:id', publicController.detalleEvento);
router.get('/autoridades', publicController.autoridades);
router.get('/galeria', publicController.galeria);
router.get('/historia', publicController.historia);
router.get('/mision-vision', publicController.misionVision);
router.get('/propuesta-educativa', publicController.propuestaEducativa);
router.get('/contacto', publicController.contacto);
router.post('/contacto', publicController.contacto);

module.exports = router;
