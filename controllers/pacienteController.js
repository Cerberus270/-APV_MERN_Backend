import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id

    try {
        const pacienteGuardado = await paciente.save()
        res.json(pacienteGuardado);
    } catch (error) {
        console.error(error)   
    }
};

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario).sort({updatedAt: -1});
    res.json(pacientes);
};

const obtenerPaciente = async (req, res) => {
    const {id} = req.params;
    try {
        const paciente = await Paciente.findById(id);

        if(!paciente) {
            return res.status(404).json({msg: "Paciente no encontrado"});
        }

        // Normally when you have a MongoDB ID, you have to convert it into a string
        if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
            return res.status(401).json({msg: "Accion no valida"});
        }

        if(paciente) {
            res.json(paciente);
        }
    } catch (error) {
        return res.status(404).json({msg: "El id ingresado no es valido"});
    }
};

const actualizarPaciente = async (req, res) => {
    const {id} = req.params;
    try {
        const paciente = await Paciente.findById(id);

        if(!paciente) {
            return res.status(404).json({msg: "Paciente no encontrado"});
        }

        // Normally when you have a MongoDB ID, you have to convert it into a string
        if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
            return res.status(401).json({msg: "Accion no valida"});
        }

        // Actualizar Paciente
        paciente.nombre = req.body.nombre || paciente.nombre;
        paciente.propietario = req.body.propietario || paciente.propietario;
        paciente.email = req.body.email || paciente.email;
        paciente.fecha = req.body.fecha || paciente.fecha;
        paciente.sintomas = req.body.sintomas || paciente.sintomas;

        try {
            const pacienteActualizado = await paciente.save();
            res.json(pacienteActualizado)
        } catch (error) {
            
        }
    } catch (error) {
        return res.status(404).json({msg: "El id ingresado no es valido"});
    }
};
const eliminarPaciente = async (req, res) => {
    const {id} = req.params;
    try {
        const paciente = await Paciente.findById(id);

        if(!paciente) {
            return res.status(404).json({msg: "Paciente no encontrado"});
        }

        // Normally when you have a MongoDB ID, you have to convert it into a string
        if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
            return res.status(401).json({msg: "Accion no valida"});
        }

        try {
            await paciente.deleteOne();
            res.json({msg: "Paciente Eliminado"})
        } catch (error) {
            console.error(error);
        }
    } catch (error) {
        return res.status(404).json({msg: "El id ingresado no es valido"});
    }
};

export { agregarPaciente, obtenerPacientes, obtenerPaciente , actualizarPaciente, eliminarPaciente }