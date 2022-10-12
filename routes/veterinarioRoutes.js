import express from "express";
import { perfil, registrar, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword } 
from "../controllers/veterinarioControllers.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas Publicas
router.post('/', registrar)
router.get('/confirmar/:token', confirmar)
router.post('/login', autenticar)
// Solicitar cambio de password
router.post('/olvide-password', olvidePassword);

/*Esto se puede simplificar con un chaining

// Validar que el Token sea valido con el Token
router.get('/olvide-password/:token', comprobarToken);
// Ruta para cambiar la contrasena en caso que el TOKEN sea valido
router.post('/olvide-password/:token', nuevoPassword)
*/
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

// Rutas Privadas
router.get('/perfil', checkAuth ,perfil);
router.put('/perfil/:id', checkAuth ,actualizarPerfil);
router.put('/actualizar-password', checkAuth ,actualizarPassword);

export default router;