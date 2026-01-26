# 🚀 Cómo Iniciar el Servidor de Correo

## ⚠️ IMPORTANTE: El servidor DEBE estar corriendo para que funcione el envío de correos

## Opción 1: Usando npm (Recomendado)

1. Abre una **nueva terminal** en la raíz del proyecto
2. Ejecuta:
   ```bash
   npm run email-server
   ```

## Opción 2: Manualmente

1. Abre una **nueva terminal**
2. Navega a la carpeta server:
   ```bash
   cd server
   ```
3. Ejecuta:
   ```bash
   node index.js
   ```

## ✅ Qué deberías ver cuando inicie correctamente:

```
Email server escuchando en http://localhost:3001
SMTP host: smtp-relay.brevo.com (o el que configuraste)
SMTP port: 587 secure: false
SMTP from: ...
SMTP user: ...
```

## ⚠️ Si ves errores:

### Error: "Cannot find module"
Ejecuta primero:
```bash
npm install
```

### Error sobre variables de entorno
Crea un archivo `.env` en la carpeta `server` con:
```env
EMAIL_SERVER_PORT=3001
CLIENT_ORIGIN=http://localhost:4200
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu_email@brevo.com
SMTP_PASS=tu_api_key_brevo
SMTP_FROM="Veterinaria <no-reply@tudominio.com>"
```

## 📝 Notas importantes:

1. **DEJA LA TERMINAL ABIERTA**: El servidor debe seguir corriendo mientras uses la aplicación
2. **No cierres la terminal**: Si la cierras, el servidor se detiene
3. **Para detener el servidor**: Presiona `Ctrl+C` en la terminal

## 🔍 Verificar que está funcionando:

Abre en tu navegador: http://localhost:3001/api/health

Deberías ver: `{"ok":true}`
