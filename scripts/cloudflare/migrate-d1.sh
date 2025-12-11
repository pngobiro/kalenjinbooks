#!/bin/bash
# Cloudflare D1 Migration Script
# Apply Prisma migrations to D1 database

set -e  # Exit on error

echo "🚀 Applying migrations to Cloudflare D1..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

DB_NAME="kalenjin-books-db"
MIGRATION_DIR="prisma/migrations"

# Check if migration directory exists
if [ ! -d "$MIGRATION_DIR" ]; then
    echo -e "${RED}❌ Migration directory not found: $MIGRATION_DIR${NC}"
    exit 1
fi

# Get the latest migration
LATEST_MIGRATION=$(ls -t "$MIGRATION_DIR" | head -1)

if [ -z "$LATEST_MIGRATION" ]; then
    echo -e "${RED}❌ No migrations found in $MIGRATION_DIR${NC}"
    exit 1
fi

MIGRATION_FILE="$MIGRATION_DIR/$LATEST_MIGRATION/migration.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo -e "${RED}❌ Migration file not found: $MIGRATION_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Migration: $LATEST_MIGRATION${NC}"
echo -e "${YELLOW}📄 File: $MIGRATION_FILE${NC}"
echo ""

# Show migration preview
echo -e "${YELLOW}📝 Migration SQL:${NC}"
head -20 "$MIGRATION_FILE"
echo ""

# Confirm before applying
read -p "Apply this migration to D1? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Migration cancelled.${NC}"
    exit 0
fi

# Apply migration
echo -e "${YELLOW}🚀 Applying migration...${NC}"
wrangler d1 execute "$DB_NAME" --file="$MIGRATION_FILE"

echo -e "${GREEN}✅ Migration applied successfully!${NC}"

# Verify tables
echo -e "${YELLOW}🔍 Verifying database schema...${NC}"
wrangler d1 execute "$DB_NAME" --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"

echo ""
echo -e "${GREEN}✅ Migration complete!${NC}"
