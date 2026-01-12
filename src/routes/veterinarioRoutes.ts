import express from "express";
import { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword,actualizarPerfil, actualizaPassword} from "../controllers/veterinarioController";
import checkAuth from "../middleware/authMiddleware";

const router = express.Router();

//Area Publica
router.post("/",registrar );
router.post("/login", autenticar);
router.get("/confirmar/:token",confirmar);
//rutas para el olvide password
//se pueden usar el mismo controlador para ambas rutas
//se genera un token para el veterinario y se envia un email con un enlace que contiene el token
router.post("/olvide-password",olvidePassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

//Area Privada
router.get("/perfil", checkAuth, perfil);
router.put("/perfil/:id", checkAuth, actualizarPerfil);
router.put("/actualizar-password/", checkAuth, actualizaPassword);

//token dinamico para confirmar cuenta
//como nombres el parametro dinamico es como lo vas a llamar en el controlador 


export default router;

