import nodemailer from "nodemailer"

const emailRegistro = async (datos) => {
    var transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token} = datos;
    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Espero que puedas probar mi aplicacion en React',
        text: 'Testing Development of Application',
        html: `<p>Este es un mensaje para comprobar que todo este bien: ${nombre}, </p>
        
                <p>Prueba el link y espero que todo este bien:
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a> </p>
        `
    });

    console.log("Mensaje enviado: %s", info.messageId);
};


export default emailRegistro