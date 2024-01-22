#!/bin/sh
# ls
# rm -rf /server/node_modules /server/dist
# npm install


mkdir -p /server/build

# Déplacer l'APK si disponible
# mv /tmp/app-debug.apk /server/build/app-debug.apk

if [ -f /tmp/app-debug.apk ]; then
    mv /tmp/app-debug.apk /server/build/app-debug.apk
else
    echo "APK not found"
fi
# Démarrer l'application server

npm run start