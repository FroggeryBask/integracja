#użycie oficalnego obrazu PostgreSQL jako obrazu bazowego
FROM postgres:latest

# Ustawienie zmiennych środowiskowych dla PostgreSQL

#domyslny użytkownik o nazwie postgres oraz haśle secret
#nazwa bazy danych, która ma zostać utworzona = userdb
#port na ktorym bedzie dzialać PostgreSQL = 5432
ENV POSTGRES_USER=postgres 
ENV POSTGRES_PASSWORD=secret
ENV POSTGRES_DB=userdb
ENV POSTGRES_PORT=5432
 
# Kopiowanie pliku init.sql do katalogu inicjalizacyjnego PostgreSQL
# Plik ten zostanie wykonany przy pierwszym uruchomieniu kontenera, aby utworzyć bazę danych i tabele
COPY init.sql /docker-entrypoint-initdb.d/

#Informacja dla dockera, że kontener nasłuchuje na porcie 5432
EXPOSE 5432
