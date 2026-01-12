import nodemailer from 'nodemailer';

interface DatosEmail {
    nombre: string;
    email: string;
    token: string;
}

const emailRegistro = async (datos: DatosEmail) => {

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
        subject: 'Confirma tu cuenta en APV',
        html: `
            <p>Hola ${nombre}, has creado tu cuenta en APV. Por favor confirma tu cuenta en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a>
            <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
        `
    });

    console.log('Email enviado a: ' + email);

}

export default emailRegistro;