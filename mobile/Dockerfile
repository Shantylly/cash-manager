# Étape 1: Base Image
FROM reactnativecommunity/react-native-android

# Étape 2: Répertoire de travail
WORKDIR /mobile

# Étape 3: Copie des fichiers
COPY . .

# Étape 4: Installation des dépendances
RUN npm install

# Étape 5: Copie de l'APK
RUN cd android && ./gradlew assembleDebug

# Étape 6: Copie de l'APK
RUN cp android/app/build/outputs/apk/debug/app-debug.apk ../../tmp/app-debug.apk
