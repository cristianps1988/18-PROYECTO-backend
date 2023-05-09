import Veterinario from '../models/Veterinario.js'
import generarJWT from '../helpers/generarJWT.js'
import generarID from '../helpers/generarID.js'
import emailRegistro from '../helpers/emailRegistro.js'
import emailOlvidePassword from '../helpers/emailOlvidePassword.js'

const registrar = async (req, res) => {

    try {
        const { email, nombre } = req.body
        // revisar si un usuario ya esta registrado
        const existeUsuario = await Veterinario.findOne({ email })
        if (existeUsuario) {
            const error = new Error('El usuario ya está registrado')
            return res.status(400).json({ msg: error.message })
        }


        // guardar nuevo veterinario
        const veterinario = new Veterinario(req.body)
        const veterinarioGuardado = await veterinario.save()

        // enviar mail
        emailRegistro({ nombre, email, token: veterinarioGuardado.token })

        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error)
    }

}

const perfil = (req, res) => {
    const { veterinario } = req
    res.json(veterinario)
}

const confirmar = async (req, res) => {
    const { token } = req.params
    const usuarioConfirmado = await Veterinario.findOne({ token })

    if (!usuarioConfirmado) {
        const error = new Error('Token no válido')
        return res.status(404).json({ msg: error.message })
    }

    try {
        usuarioConfirmado.token = null
        usuarioConfirmado.confirmado = true
        await usuarioConfirmado.save()

        res.json({ msg: 'Usuario confirmado correctamente' })
    } catch (error) {
        console.log(error)
    }
}

const autenticar = async (req, res) => {
    const { email, password } = req.body

    // Comprobar que el usuario exista
    const usuario = await Veterinario.findOne({ email })
    if (!usuario) {
        const error = new Error('Usuario no válido')
        return res.status(403).json({ msg: error.message })
    }

    // comprobar que el usuario este confirmado
    if (!usuario.confirmado) {
        const error = new Error('El usuario no se ha confirmado')
        return res.status(403).json({ msg: error.message })
    }

    // revisar el password
    if (await usuario.comprobarPassword(password)) {
        // autenticar usuario
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        })
    } else {
        const error = new Error('Contraseña incorrecta')
        return res.status(403).json({ msg: error.message })
    }

}

const olvidePassword = async (req, res) => {
    const { email } = req.body
    const existeVeterinario = await Veterinario.findOne({ email })
    if (!existeVeterinario) {
        const error = new Error('El usuario no existe')
        return res.status(400).json({ msg: error.message })
    }

    try {
        existeVeterinario.token = generarID()
        await existeVeterinario.save()

        // enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({ msg: 'Se envió un email con las instrucciones' })
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params
    const tokenValido = await Veterinario.findOne({ token })

    if (tokenValido) {
        res.json({ msg: 'Token valido, el usuario existe' })
    } else {
        const error = new Error('Token no válido')
        return res.status(403).json({ msg: error.message })
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    const veterinario = await Veterinario.findOne({ token })

    if (!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({ msg: error.message })
    }

    try {
        veterinario.token = null
        veterinario.password = password
        await veterinario.save()
        console.log(password)
        res.json({ msg: 'Password guardado exitosamente' })
    } catch (error) {
        console.log(error)
    }
}



export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
}