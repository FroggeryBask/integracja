# Użycie oficjalnego obrazu MongoDB (najnowsza wersja) jako obrazu bazowego
FROM mongo:latest 

# Skopiowanie pliku z kopią zapasową bazy danych (dump) do tymczasowego katalogu w kontenerze
COPY db.dump /tmp/db.dump

# Skopiowanie skryptu inicjalizacyjnego do specjalnego katalogu MongoDB,
# który automatycznie wykonuje skrypty przy pierwszym uruchomieniu kontenera
COPY init-mongo.sh /docker-entrypoint-initdb.d/

# Nadanie uprawnień execute (wykonywalności) skryptowi inicjalizacyjnemu
# Upewniamy się, że skrypt ma odpowiednie uprawnienia do wykonania
RUN chmod +x /docker-entrypoint-initdb.d/init-mongo.sh

# Ustawienie zmiennych środowiskowych definiujących:
# - nazwę użytkownika administratora bazy danych
ENV MONGO_INITDB_ROOT_USERNAME=admin
# - hasło użytkownika administratora
ENV MONGO_INITDB_ROOT_PASSWORD=secret
# - nazwę bazy danych, która ma zostać zainicjalizowana
ENV MONGO_INITDB_DATABASE=statsdb_backup

# Deklaracja portu, na którym nasłuchuje MongoDB
EXPOSE 27017

