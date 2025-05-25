#!/bin/bash

# Exit if any command fails
set -e

echo "Waiting for PostgreSQL..."
# This loop checks if PostgreSQL is ready to accept connections
while ! pg_isready -h db -p 5432 -U postgres; do
  echo "PostgreSQL not ready - waiting 1 second..."
  sleep 1
done
echo "PostgreSQL is ready!"

# Run database migrations automatically
echo "Applying database migrations..."
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start the Django development server
echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000