#Użycie oficjalnego obrazu Node.js w wersji 18 jako podstawy kontenera
FROM node:18

# Ustawienie katalogu roboczego wewnątrz kontenera
WORKDIR /usr/src/app

# Kopiowanie plików konfiguracyjnych projektu do katalogu roboczego kontenera
# Kopiowanie najpierw package.json i package-lock.json 
# aby wykorzystać mechanizm cache'owania Dockera (warstwy obrazu)
COPY package.json package-lock.json eslint.config.mjs jsconfig.json next.config.mjs postcss.config.mjs auth.ts tsconfig.json db.ts ./

# Kopiowanie katalogu src/ z kodem źródłowym aplikacji
COPY src ./src

# Kopiowanie katalogu public/ z zasobami statycznymi
COPY public ./public

# Kopiowanie skryptu wejściowego (entrypoint) w standardowej lokalizacji
COPY docker-entrypoint.sh /usr/local/bin/

# Instalacja zależności z flagą legacy-peer-deps (dla kompatybilności)
# oraz nadanie uprawnień do wykonywania skryptu entrypoint
RUN npm install --legacy-peer-deps && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

#Ustawienie portu 3000, na którym aplikacja będzie nasłuchiwać
EXPOSE 3000

# Definicja entrypoint - skrypt który będzie wykonany przy starcie kontenera
ENTRYPOINT ["docker-entrypoint.sh"]

#Uruchomienie komendy terminalowej "npm run dev" do uruchomienia aplikacji
CMD ["npm", "run", "dev"]

