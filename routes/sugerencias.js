const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/user");

router.get("/sugerencias", isAuthenticated, async (req, res) => {
  const success = req.query.success; // Obtener el parámetro de consulta "success"
  const error = req.query.error;
  const user = req.user; // Obtener el usuario autenticado
  res.render("sugerencias_formulario", { success, error, user }); // Pasar el parámetro "success" a la vista
});

// Ruta para procesar el envío del formulario de sugerencias
router.post("/sugerencias/enviar", isAuthenticated, async (req, res) => {
  const { name: subject, suggestion } = req.body;
  const user = req.user;

  try {
    //TODO Seguramente sería mejor poner los datos de inicio de sesión en las variables de entorno
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SUGERENCIAS_HOST,
      port: process.env.EMAIL_SUGERENCIAS_PORT,
      auth: {
        user: process.env.EMAIL_SUGERENCIAS_SENDER_USER,
        pass: process.env.EMAIL_SUGERENCIAS_SENDER_PASS,
      },
    });

    // Opciones del correo electrónico
    let mailOptions = {
      from: process.env.EMAIL_SUGERENCIAS_SENDER_USER,
      to: process.env.EMAIL_SUGERENCIAS_RECEIVER_USER,
      subject: `Sugerencia: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px;">
            <h2 style="color: #4CAF50;">📢 Nueva sugerencia recibida</h2>
            <p><strong>De:</strong> ${user.nombre} ${user.apellidos}</p>
            <p><strong>Correo:</strong> ${user.email}</p>
            <p><strong>Rol:</strong> ${user.rol}</p>
            <hr style="border: none; border-top: 1px solid #ddd;" />
            <p style="margin-top: 10px;"><strong>Sugerencia:</strong></p>
            <p style="background: #f9f9f9; padding: 10px; border-radius: 5px;">
                ${suggestion}
            </p>
        </div>
    `,
    };

    // Enviar correo electrónico al administrador
    const info = await transporter.sendMail(mailOptions);
    console.log("Email enviado: " + info.response);

    // Redireccionar con parámetro de éxito
    res.redirect("/sugerencias?success=true");
  } catch (error) {
    console.log(error);

    // Redireccionar con parámetro de error
    res.redirect("/sugerencias?error=true");
  }
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/");
}

module.exports = router;
