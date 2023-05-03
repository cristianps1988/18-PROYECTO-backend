import express from "express";
import dotenv from 'dotenv'
import conectarDB from "./config/db.js";
import routerVeterinario from './routes/veterinarioRoutes.js'

const app = express()

app.use(express.json())

dotenv.config()

conectarDB()

app.use("/api/veterinarios", routerVeterinario)

const PORT = process.env.POR || 4000

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})