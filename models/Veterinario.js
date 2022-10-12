import mongoose from "mongoose";
import generarId from "../helpers/generarId.js";
import bcrypt from "bcrypt";

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    telefono: {
        type: String,
        default: null,
        trim: true,
    },
    web: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: generarId(),
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

//Este es un middleware
veterinarioSchema.pre('save', async function(next) {
    // Este if verifica si ya se hasheo un password anterior para no hashearlo nuevamente
    if(!this.isModified("password")){
        // Next sirve para que se vaya al siguiente middleware
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);
};

const Veterinario = mongoose.model("Veterinario", veterinarioSchema);

export default Veterinario; 