# Email server

Configura estas variables de entorno antes de iniciar el servidor:

```
EMAIL_SERVER_PORT=3001
CLIENT_ORIGIN=http://localhost:4200

SMTP_HOST=smtp.tudominio.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=usuario@tudominio.com
SMTP_PASS=tu_password
SMTP_FROM="Veterinaria <no-reply@tudominio.com>"
```

Notas:
- Si usas Gmail, debes crear una contraseña de aplicación y usarla en `SMTP_PASS`.
- Verifica en la consola del servidor que las variables estén cargadas.
