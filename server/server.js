const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio'); // Importa Twilio

const app = express();
const PORT = process.env.PORT || 3000;

// Configura SendGrid con tu clave API
sgMail.setApiKey('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');

// Configura Twilio con tu Account SID y Auth Token
const accountSid = 'AC804ff9acbba44e813a6eecd08c7f0e65'; // Reemplaza con tu Account SID de Twilio
const authToken = '6aa3abb1506d1c2507cae600096f50c3'; // Reemplaza con tu Auth Token de Twilio
const client = twilio(accountSid, authToken);

app.use(cors({
  origin: 'http://localhost:8100', // Permitir solo tu aplicación Angular
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(express.json());

// Ruta para enviar correos
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  const msg = {
    to: to,
    from: 'caneovilches46@gmail.com',
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

// Ruta para enviar SMS usando Twilio
app.post('/send-sms', async (req, res) => {
  const { to, message } = req.body;

  try {
    const sms = await client.messages.create({
      body: message,
      from: '+15202234648', // Número de teléfono de Twilio
      to: to, // Número de teléfono del destinatario
    });
    res.status(200).send({ message: 'SMS enviado con éxito', sid: sms.sid });
  } catch (error) {
    console.error('Error al enviar el SMS:', error);
    res.status(500).send({ error: 'Error al enviar el SMS' });
  }
});

// Ruta de ejemplo
app.get('/envio', (req, res) => {
  res.send('Página de envío');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
