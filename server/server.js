const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 3000;

// Configura SendGrid con tu clave API
sgMail.setApiKey('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'); // Reemplaza con tu clave API de SendGrid

// Configura CORS
app.use(cors({
  origin: 'http://localhost:8100', // Permitir solo tu aplicación Angular
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
  credentials: true, // Permitir cookies
}));

app.use(express.json());

// Ruta para enviar correos
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  const msg = {
    to: to,
    from: 'caneovilches46@gmail.com', // Asegúrate de usar un correo verificado en SendGrid
    subject: subject,
    text: text,
    html: `<p>${text}</p>`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send({ message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).send({ error: 'Error al enviar el correo' });
  }
});

// Ruta de ejemplo (opcional)
app.get('/envio', (req, res) => {
  res.send('Página de envío'); // Puedes personalizar esto
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
