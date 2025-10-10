const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../models/user');

router.get('/sugerencias', isAuthenticated, async (req, res) => {
    const success = req.query.success; // Obtener el parámetro de consulta "success"
    const error = req.query.error;
    const user = req.user; // Obtener el usuario autenticado
    res.render('sugerencias_formulario', { success, error, user }); // Pasar el parámetro "success" a la vista
});

// Ruta para procesar el envío del formulario de sugerencias
router.post('/sugerencias/enviar', isAuthenticated, async (req, res) => {
    const { name: subject, suggestion } = req.body;
    const user = req.user;

    try {
        //TODO Seguramente sería mejor poner los datos de inicio de sesión en las variables de entorno
        const transporter = nodemailer.createTransport({
            host: smtp.ethereal.email,
            port: 587,
            auth: {
                user: "gaylord35@ethereal.email",
                pass: "CpDCAKnFu2kyVt4WUE"
            }
        });

        // Opciones del correo electrónico
        let mailOptions = {
            from: "gaylord35@ethereal.email",
            to: "elliecolorado@protonmail.com",
            subject: `Sugerencia: ${subject}`,
            text: `Sugerencia realizada por: ${user.nombre} ${user.apellidos} | (${user.email}) | ${user.rol}\n${suggestion}`
        };

        // Enviar correo electrónico al administrador
        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado: ' + info.response);

        // Redireccionar con parámetro de éxito
        res.redirect('/sugerencias?success=true');
    } catch (error) {
        console.log(error);

        // Redireccionar con parámetro de error
        res.redirect('/sugerencias?error=true');
    }
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

module.exports = router;
