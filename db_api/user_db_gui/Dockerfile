# Użycie oficjalnego obrazu pgAdmin4 jako obrazu bazowego
FROM dpage/pgadmin4:latest

# Ustawienie zmiennej środowiskowej określającej domyślny adres email dla konta administratora pgAdmin
ENV PGADMIN_DEFAULT_EMAIL=test@test.com
# Ustawienie zmiennej środowiskowej określającej domyślne hasło dla konta administratora pgAdmin
ENV PGADMIN_DEFAULT_PASSWORD=secret

# Udostępnienie portu 80 na kontenerze (domyślny port HTTP dla pgAdmin)
EXPOSE 80
