# Użycie oficjalnego obrazu Node.js w wersji 18 jako podstawy kontenera
FROM node:18

# Ustawienie katalogu roboczego wewnątrz kontenera
WORKDIR /usr/src/app

# Skopiowanie pliku package.json do katalogu roboczego kontenera
COPY package.json ./

# Instalacja zależności projektu zdefiniowanych w package.json
RUN npm install

# Skopiowanie pliku server.js do katalogu roboczego kontenera
COPY server.js ./

# Deklaracja portu, na którym aplikacja będzie nasłuchiwać
# (Port musi być jeszcze przekierowany przy uruchamianiu kontenera)
EXPOSE 3018

# Komenda terminalowa "npm run dev" do uruchomienia aplikacji
CMD ["npm", "run", "dev"]

