# 1. Starten mit einem offiziellen Node.js-Basis-Image
FROM node:18-alpine

# 2. Den Arbeitsordner im Container festlegen
WORKDIR /app

# Hier installieren wir das Profi-Tool global im Container
RUN npm install -g nodemon

# 3. Den Quellcode der App in den Container kopieren
COPY . .

# 4. Den Port 3000 nach außen hin freigeben
EXPOSE 3000

# 5. Der Befehl, der ausgeführt wird, wenn der Container startet
CMD ["nodemon", "server.js"]
