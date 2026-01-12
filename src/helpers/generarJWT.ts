
import jwt from 'jsonwebtoken';

const generarJWT = (id: string) => {

    //Generar el JWT con el id del usuario
    return jwt.sign({id}, process.env.JWT_SECRET!, {
        expiresIn: '30d',
    });

};

export default generarJWT;