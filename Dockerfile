# Utiliser l'image officielle Node.js
FROM node:20

# Définir le répertoire de travail
WORKDIR /sample_node

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port de l'API (par défaut 3000)
EXPOSE 8010

# Démarrer le serveur
CMD ["node", "server.js"]