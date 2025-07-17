#!/bin/bash

# Directorul rădăcină unde vor fi stocate informațiile despre utilizatori
ROOT_DIR="/tmp/active_users"
INTERVAL=30 

#Verificam directorul rădăcină există
mkdir -p "$ROOT_DIR"

while true; do
    echo "- Actualizarea informațiilor despre utilizatori -"

    # Obținem lista utilizatorilor activi din sistem
    active_users=$(who | awk '{print $1}' | sort | uniq)
    echo "Utilizatorii activi detectați: $active_users"

    # Actualizeazăm informațiile pentru utilizatorii activi
    for user in $active_users; do
        echo "Procesăm utilizatorul: $user"

        # Creează directorul pentru utilizatorul curent
        user_dir="$ROOT_DIR/$user"
        mkdir -p "$user_dir"

        # Actualizeazăm fișierul "procs" cu procesele utilizatorului
        ps -u "$user" -o pid,cmd > "$user_dir/procs"
        if [ $? -eq 0 ]; then
            echo "Fișierul 'procs' pentru $user a fost actualizat."
            echo "Procesele curente ale utilizatorului $user:" > "$user_dir/procs"
            ps -u "$user" -o pid,cmd >> "$user_dir/procs"
            cat "$user_dir/procs"
            echo "----------------------------------------"
        else
            echo "A apărut o eroare la actualizarea fișierului 'procs' pentru $user."
        fi
    done

    # Verificăm utilizatorii care nu mai sunt activi
    for user_dir in "$ROOT_DIR"/*; do
        user=$(basename "$user_dir")
        if ! echo "$active_users" | grep -q "^$user$"; then
            echo "Utilizatorul $user nu mai este activ. Golesc fișierul 'procs' și actualizez 'lastlogin'."

            # Golim fișierul "procs"
            > "$user_dir/procs"

            # Cream/actualizeazăm fișierul "lastlogin" cu data ultimei sesiuni
            last_login=$(last -n 1 "$user"  | grep "$user" | head -n 1 | awk '{print $4, $5, $6, $7}')
            if [ -n "$last_login" ]; then
                echo "$last_login" > "$user_dir/lastlogin"
                echo "Ultimul login pentru utilizatorul $user: $last_login"
            else
                echo "Data ultimei sesiuni nu este disponibilă pentru $user." > "$user_dir/lastlogin"
            fi
        fi
    done

    echo "- Finalizat ciclul de actualizare. Așteptăm $INTERVAL secunde. -"
    sleep "$INTERVAL"
done
