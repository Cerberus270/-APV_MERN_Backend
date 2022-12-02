import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js"

const registrar = async (req, res) => {
    const { nombre, email, password } = req.body;

    // Prevenir usuarios registrados

    const existeUsuario = await Veterinario.findOne({ email });

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message });
    }


    try {
        // Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinariogGuardado = await veterinario.save();

        // Enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinariogGuardado.token
        });

        // Enviando Mensaje
        res.json({
            veterinariogGuardado
        })
    } catch (error) {
        console.error(error)
    }
};

const perfil = (req, res) => {
    const { veterinario } = req;
    res.json(veterinario);
};

const confirmar = async (req, res) => {
    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({ token });

    if (!usuarioConfirmar) {
        const error = new Error('Token no valido');
        return res.status(404).json({ msg: error.message });
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({
            msg: "Usuario confirmado correctamente"
        })
    } catch (error) {
        console.log(error);
    }

};

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({ email });
    if (!usuario) {
        const error = new Error('El Usuario no existe');
        return res.status(404).json({ msg: error.message });
    }

    // Comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    // Autenticar al usuario
    // Revisar el password
    try {
        if (await usuario.comprobarPassword(password)) {
            res.json({
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                telefono: usuario.telefono,
                web: usuario.web,
                token: generarJWT(usuario.id)
            });
        } else {
            const error = new Error('El password es incorrecto');
            return res.status(403).json({ msg: error.message });
        }
    } catch (error) {
        console.error(error)
    }
}

const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const existeVeterinario = await Veterinario.findOne({ email });
    console.log(existeVeterinario);
    if (!existeVeterinario) {
        const error = new Error('El Usuario no existe')
        return res.status(400).json({ msg: "El usuario no existe" })
    }
    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();
        // Enviar Email con las instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })
        return res.json({ msg: "Hemos enviado un email con las instrucciones" });
    } catch (error) {
        console.error(error)
    }
    res.json({ msg: 'Desde Olvide Password' })
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    console.log(token);
    const tokenValido = await Veterinario.findOne({ token });

    if (tokenValido) {
        // El Token es valido el usuario existe
        res.json({ msg: 'Token valido y el usuario existe' });
    } else {
        const error = new Error("El token no es valido");
        return res.status(401).json({ msg: error.message });
    }
}
const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token });
    if (!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: "password modificado correctamente" });
    } catch (error) {
        console.error(error);
    }
}

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    const { email } = req.body
    if (veterinario.email !== email) {
        const existeEmail = await Veterinario.findOne({ email });
        if (existeEmail) {
            const error = new Error('Ese email ya esta en uso');
            return res.status(400).json({ msg: error.message });
        }
    }

    try {
        veterinario.nombre = req.body.nombre || veterinario.nombre;
        veterinario.email = req.body.email || veterinario.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        console.log("Hola soy yo: ", veterinarioActualizado)
        res.json({
            _id: veterinarioActualizado._id,
            nombre: veterinarioActualizado.nombre,
            email: veterinarioActualizado.email,
            telefono: veterinarioActualizado.telefono,
            web: veterinarioActualizado.web,
        });
    } catch (error) {
        console.log(error)
    }
}

const actualizarPassword = async (req, res) => {
    // Leer los datos
    const { id } = req.veterinario;
    const { passwordActual, nuevoPassword } = req.body;
    // Comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id);
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }
    // Comprobar su password
    if (await veterinario.comprobarPassword(passwordActual)) {
        // Almacena el nuevo password
        veterinario.password = nuevoPassword;
        await veterinario.save();
        res.json({ msg: 'Password almacenado correctamente' });
    } else {
        const error = new Error('El Password Actual es Incorrecto');
        return res.status(400).json({ msg: error.message });
    }

}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}