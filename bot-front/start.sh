#!/bin/sh

# Crear el archivo de configuración JSON
cat <<EOF > /usr/share/nginx/html/assets/config.json
{
  "apiBack": "${API_BACK}",
  "apiBot": "${API_BOT}"
}
EOF

# Iniciar Nginx
nginx -g 'daemon off;'