import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
    // enviar mail
    const { nombre, email, token } = datos

    const info = await transporter.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject: "Confirma tu cuenta en APV",
        text: "Confirma tu cuenta en APV",
        html: `
                <p>Hola ${nombre}, confirma tu cuenta en APV</p>
                <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace
                <a href="${process.env.FRONT_URL}/confirmar/${token}" >Confirmar cuenta</a></p>
                <p>Si no creaste esta cuenta, puedes ignorar este mensaje</p>
        `,
    })

    console.log('Mensaje enviado: %s', info.messageId)

}

export default emailRegistro