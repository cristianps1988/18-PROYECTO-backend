import Veterinario from '../models/Veterinario.js'
import generarJWT from '../helpers/generarJWT.js'

const registrar = async (req, res) => {

    try {
        const { email } = req.body
        // revisar si un usuario ya esta registrado
        const existeUsuario = await Veterinario.findOne({ email })
        if (existeUsuario) {
            const error = new Error('El usuario ya está registrado')
            return res.status(400).json({ msg: error.message })
        }


        // guardar nuevo veterinario
        const veterinario = new Veterinario(req.body)
        const veterinarioGuardado = await veterinario.save()

        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error)
    }

}

const perfil = (req, res) => {
    const { veterinario } = req
    res.json({ perfil: veterinario })
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
        res.json({ token: generarJWT(usuario.id) })
    } else {
        const error = new Error('Contraseña incorrecta')
        return res.status(403).json({ msg: error.message })
    }

}

export {
    registrar,
    perfil,
    confirmar,
    autenticar
}