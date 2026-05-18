# Guía de Despliegue 24/7 en Railway

## Pasos para desplegar tu bot en Railway

### 1. Preparar el repositorio
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Subir a GitHub
- Crea un nuevo repositorio en GitHub
- Conecta tu repositorio local:
```bash
git remote add origin https://github.com/tu-usuario/mibot.git
git branch -M main
git push -u origin main
```

### 3. Crear cuenta en Railway
- Ve a [railway.app](https://railway.app)
- Regístrate con tu cuenta de GitHub
- Verifica tu email

### 4. Crear nuevo proyecto en Railway
- Click en "New Project"
- Selecciona "Deploy from GitHub repo"
- Elige tu repositorio `mibot`

### 5. Configurar variables de entorno
En el dashboard de Railway, ve a "Variables" y agrega:

```
DISCORD_TOKEN=tu_token_del_bot
DISCORD_CLIENT_ID=tu_client_id
PORT=3000
TICKET_CHANNEL_NAME=tickets
WELCOME_CHANNEL_NAME=bienvenida
GOODBYE_CHANNEL_NAME=despedidas
LEVEL_CHANNEL_NAME=niveles
LOG_CHANNEL_NAME=logs
AUTO_ROLE_NAME=Miembro
MOD_ROLE_NAME=MOD
```

**IMPORTANTE:** Obtén el token de tu bot en [Discord Developer Portal](https://discord.com/developers/applications)

### 6. Desplegar
- Railway detectará automáticamente que es un proyecto Node.js
- El despliegue comenzará automáticamente
- Espera a que aparezca el check verde ✅

### 7. Verificar el despliegue
- En el dashboard de Railway, verás la URL de tu bot
- Click en "View Logs" para ver si el bot se conectó correctamente
- Deberías ver mensajes como "🟢 Bot en línea"

### 8. Registrar comandos del bot
Si necesitas registrar los comandos slash:
```bash
node deploy-commands.js
```
(Ejecuta esto localmente o en el terminal de Railway)

## Costo
- Railway: ~$5/mes (plan básico)
- Incluye 512MB RAM, suficiente para tu bot

## Mantenimiento
- El bot se reinicia automáticamente si falla
- Railway mantiene el bot 24/7 sin necesidad de tu PC
- Puedes ver logs en tiempo real desde el dashboard

## Solución de problemas
- Si el bot no se conecta, verifica que el DISCORD_TOKEN sea correcto
- Revisa los logs en Railway para ver errores
- Asegúrate de que las variables de entorno estén configuradas correctamente
