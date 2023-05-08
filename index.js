import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import conectarDB from "./config/db.js";
import routerVeterinario from './routes/veterinarioRoutes.js'
import routerPaciente from './routes/pacienteRoutes.js'

const app = express()

app.use(express.json())

dotenv.config()

conectarDB()

const dominiosPermitidos = [process.env.FRONT_URL]
const corsOpctions = {
    origin: function (origin, cb) {
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            cb(null, true)
        } else {
            cb(new Error('No permitido por CORS'))
        }
    }
}
app.use(cors(corsOpctions))

app.use("/api/veterinarios", routerVeterinario)
app.use("/api/pacientes", routerPaciente)

const PORT = process.env.POR || 4000

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})