import Paciente from "../models/Paciente.js"

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find()
        .where("veterinario")
        .equals(req.veterinario)
    res.json(pacientes)
}

const agregarPacientes = async (req, res) => {
    const paciente = new Paciente(req.body)
    paciente.veterinario = req.veterinario._id
    try {
        const pacienteAlmacenado = await paciente.save()
        res.json(pacienteAlmacenado)
    } catch (error) {
        console.log(error)
    }
}

const obtenerPaciente = async (req, res) => {
    const { id } = req.params
    const paciente = await Paciente.findById(id)

    if (!paciente) {
        return res.status(404).json({ msg: 'Paciente no encontrado' })
    }

    if (paciente.veterinario._id.toString() != req.veterinario._id.toString()) {
        return res.json({ msg: 'Acción no permitida' })
    }

    res.json(paciente)
}

const actualizarPaciente = async (req, res) => {
    const { id } = req.params
    const paciente = await Paciente.findById(id)

    if (!paciente) {
        return res.status(404).json({ msg: 'Paciente no encontrado' })
    }

    if (paciente.veterinario._id.toString() != req.veterinario._id.toString()) {
        return res.json({ msg: 'Acción no permitida' })
    }

    // actualizar paciente
    paciente.nombre = req.body.nombre || paciente.nombre
    paciente.propietario = req.body.propietario || paciente.propietario
    paciente.email = req.body.email || paciente.email
    paciente.sintomas = req.body.sintomas || paciente.sintomas

    try {
        const pacienteActualizado = await paciente.save()
        res.json(pacienteActualizado)
    } catch (error) {
        console.log(error)
    }
}

const eliminarPaciente = async (req, res) => {
    const { id } = req.params
    const paciente = await Paciente.findById(id)

    if (!paciente) {
        return res.status(404).json({ msg: 'Paciente no encontrado' })
    }

    if (paciente.veterinario._id.toString() != req.veterinario._id.toString()) {
        return res.json({ msg: 'Acción no permitida' })
    }

    try {
        await paciente.deleteOne()
        res.json({ msg: 'Paciente eliminado exitosamente' })
    } catch (error) {
        console.log(error)
    }
}

export {
    obtenerPacientes,
    agregarPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}