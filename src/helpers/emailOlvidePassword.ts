import nodemailer from 'nodemailer';

interface DatosEmail {
    nombre: string;
    email: string;
    token: string;
}

const emailOlvideMiPassword = async (datos: DatosEmail) => {

    const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
    });

    const { nombre, email, token } = datos;

    //Enviar el email
    await transport.sendMail({
        from: 'APV - Administrador de Pacientes de Veterinaria <apv@veterinaria.com>',
        to: email,
        subject: 'Reestablece tu password en APV',
        html: `
        <p>Hola ${nombre}, has solicitado reestablecer tu password.</p>
        <p>Para reestablecer tu password, haz click en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
        `
    });

    console.log('Email enviado a: ' + email);

}

export default emailOlvideMiPassword;