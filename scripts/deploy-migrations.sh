#!/bin/bash

# Script to deploy Supabase migrations to self-hosted instance
# Usage: ./scripts/deploy-migrations.sh

set -e

echo "🚀 Deploying Supabase Migrations..."

# Check if SUPABASE_DB_URL is set
if [ -z "$SUPABASE_DB_URL" ]; then
    echo "❌ Error: SUPABASE_DB_URL environment variable is not set"
    echo "Set it like: export SUPABASE_DB_URL=postgresql://postgres:password@host:5432/postgres"
    exit 1
fi

# Get the directory where migrations are stored
MIGRATIONS_DIR="supabase/migrations"

if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "❌ Error: Migrations directory not found: $MIGRATIONS_DIR"
    exit 1
fi

# Run migrations in order
echo "📦 Found migrations in $MIGRATIONS_DIR"
echo "🔗 Connecting to: ${SUPABASE_DB_URL%%@*}@***"

for migration_file in "$MIGRATIONS_DIR"/*.sql; do
    if [ -f "$migration_file" ]; then
        filename=$(basename "$migration_file")
        echo "📄 Running migration: $filename"
        psql "$SUPABASE_DB_URL" -f "$migration_file" || {
            echo "❌ Error running migration: $filename"
            exit 1
        }
    fi
done

echo "✅ All migrations deployed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Create your first admin user in Supabase SQL Editor"
echo "2. Configure auth redirect URLs in Supabase Dashboard"
echo "3. Test the application"

