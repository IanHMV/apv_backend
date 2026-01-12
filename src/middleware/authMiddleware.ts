import jwt from 'jsonwebtoken';
import { Veterinario } from '../models/Veterinario';

interface JwtAuthPayload extends jwt.JwtPayload {
  id: string;
}

const checkAuthHeader = async (req: any, res: any, next: any) => {

  // Obtener el header Authorization
  const auth = req.headers.authorization;

  // Verificar que el header Authorization esté presente y tenga el formato correcto
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Token no proporcionado' });
  }

  // Extraer token sin el prefijo 'Bearer '
  const token = auth.split(' ')[1];

  try {
    // Verificar token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default_secret'
    ) as JwtAuthPayload;

    // Obtener usuario
    const veterinario = await Veterinario.findById(decoded.id)
      .select('-password -token -confirmado -__v');

    if (!veterinario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Guardar usuario en la request
    req.veterinario = veterinario;

    return next(); // Todo OK

  } catch (error) {
    return res.status(403).json({ msg: 'Token no válido' });
  }
};

export default checkAuthHeader;
