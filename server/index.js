const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envPath = fs.existsSync(path.join(__dirname, '.env'))
  ? path.join(__dirname, '.env')
  : path.join(process.cwd(), '.env');
dotenv.config({ path: envPath });

const app = express();
const port = process.env.EMAIL_SERVER_PORT || 3001;

// Configuración CORS más permisiva para desarrollo
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:4200',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Manejar preflight OPTIONS explícitamente
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_ORIGIN || 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

app.use(express.json());

const smtpHost = process.env.SMTP_HOST || process.env.MAIL_HOST;
const smtpPort = Number(process.env.SMTP_PORT || process.env.MAIL_PORT || 587);
const smtpSecure = String(process.env.SMTP_SECURE || process.env.MAIL_SECURE || 'false').toLowerCase() === 'true';
const smtpUser = process.env.SMTP_USER || process.env.MAIL_USER;
const smtpPass = process.env.SMTP_PASS || process.env.MAIL_PASS;
const fromName = process.env.MAIL_FROM_NAME || 'Veterinaria Zift';
const smtpFrom =
  process.env.SMTP_FROM ||
  (process.env.MAIL_FROM_EMAIL
    ? `${fromName} <${process.env.MAIL_FROM_EMAIL}>`
    : process.env.MAIL_FROM_EMAIL);

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: smtpUser
    ? {
        user: smtpUser,
        pass: smtpPass,
      }
    : undefined,
});

app.post('/api/appointments/notify', async (req, res) => {
  // Agregar headers CORS explícitamente
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_ORIGIN || 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  console.log('📧 POST /api/appointments/notify recibido');
  console.log('Body:', req.body);

  const {
    ownerEmail,
    ownerName,
    telefono,
    nombreMascota,
    especie,
    servicio,
    doctorName,
    fecha,
    hora,
    notas,
  } = req.body || {};

  if (!ownerEmail || !ownerName || !servicio || !fecha || !hora) {
    console.log('❌ Faltan datos obligatorios');
    return res.status(400).json({ error: 'Faltan datos obligatorios para enviar el correo.' });
  }

  if (!smtpHost || !smtpFrom) {
    return res.status(500).json({ error: 'Servidor de correo no configurado.' });
  }

  const subject = 'Cita agendada - Veterinaria Zift';
  const plainText = [
    `Hola ${ownerName},`,
    '',
    'Tu cita fue agendada correctamente.',
    '',
    `Servicio: ${servicio}`,
    `Veterinario: ${doctorName || '-'}`,
    `Fecha: ${fecha}`,
    `Hora: ${hora}`,
    `Mascota: ${nombreMascota || '-'}`,
    `Especie: ${especie || '-'}`,
    `Teléfono: ${telefono || '-'}`,
    `Notas: ${notas || '-'}`,
    '',
    'Gracias por confiar en nosotros.',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5">
      <h2>✅ Cita agendada - Veterinaria Zift</h2>
      <p>Hola ${ownerName},</p>
      <p>Tu cita fue agendada correctamente.</p>
      <ul>
        <li><strong>Servicio:</strong> ${servicio}</li>
        <li><strong>Veterinario:</strong> ${doctorName || '-'}</li>
        <li><strong>Fecha:</strong> ${fecha}</li>
        <li><strong>Hora:</strong> ${hora}</li>
        <li><strong>Mascota:</strong> ${nombreMascota || '-'}</li>
        <li><strong>Especie:</strong> ${especie || '-'}</li>
        <li><strong>Teléfono:</strong> ${telefono || '-'}</li>
        <li><strong>Notas:</strong> ${notas || '-'}</li>
      </ul>
      <p>Gracias por confiar en nosotros.</p>
    </div>
  `;

  try {
    console.log('📤 Enviando correo a:', ownerEmail);
    await transporter.sendMail({
      from: smtpFrom,
      to: ownerEmail,
      subject,
      text: plainText,
      html,
    });

    console.log('✅ Correo enviado exitosamente');
    return res.status(200).json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo enviar el correo.';
    console.error('❌ Error enviando correo:', message);
    console.error('Error completo:', error);
    return res.status(500).json({ error: message });
  }
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Email server escuchando en http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log('SMTP host:', process.env.SMTP_HOST || 'no-configurado');
  // eslint-disable-next-line no-console
  console.log('SMTP port:', smtpPort, 'secure:', smtpSecure);
  // eslint-disable-next-line no-console
  console.log('SMTP from:', process.env.SMTP_FROM || 'no-configurado');
  // eslint-disable-next-line no-console
  console.log('SMTP user:', process.env.SMTP_USER || 'no-configurado');
});
