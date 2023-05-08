import nodemailer from 'nodemailer'

const emailOlvidePassword = async (datos) => {
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
        subject: "Restablece tu Password",
        text: "Restablece tu Password",
        html: `
                <p>Hola ${nombre}, has solicitado restablecer tu password</p>
                <p>Da click en el siguiente link para restablecer tu password
                <a href="${process.env.FRONT_URL}/olvide-password/${token}" >Restablecer Password</a></p>
                <p>Si no creaste esta cuenta, puedes ignorar este mensaje</p>
        `,
    })

    console.log('Mensaje enviado: %s', info.messageId)

}

export default emailOlvidePassword