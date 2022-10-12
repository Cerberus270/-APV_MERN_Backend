import express  from "express";
import conectarDB from "./config/db.js";
import cors from "cors"
import veterinarioRoutes from "./routes/veterinarioRoutes.js"
import pacienteRoutes from './routes/pacienteRoutes.js'

const app = express();

app.use(express.json())

conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL]

console.log(dominiosPermitidos);
const corsOptions = {
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1 || !origin){
            // El Origen del Request esta permitido
            callback(null, true)
        } else {
            callback(new Error('Ah prro sos hacker :v'))
        }
    }
}

// Implementando CORS en Express
app.use(cors(corsOptions));

app.use('/api/veterinarios', veterinarioRoutes)
app.use('/api/pacientes', pacienteRoutes)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
})