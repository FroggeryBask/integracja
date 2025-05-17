#!/bin/sh

echo "Running entrypoint..."  

npx auth secret
echo "auth secret command finished"

cat <<EOF >> .env.local
databaseconfig
DATABASE_HOST=userdb
DATABASE_NAME=userdb
DATABASE_USER=postgres
DATABASE_PASSWORD=secret
EOF

echo "Database config appended"
exec "$@"