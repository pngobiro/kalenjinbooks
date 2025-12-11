#!/bin/bash
# Cloudflare D1 Database Setup Script
# This script creates and initializes the D1 database for KalenjinBooks

set -e  # Exit on error

echo "🚀 Setting up Cloudflare D1 Database..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI not found. Installing...${NC}"
    npm install -g wrangler
fi

# Check if user is logged in
echo -e "${YELLOW}📋 Checking Cloudflare authentication...${NC}"
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}🔐 Please login to Cloudflare...${NC}"
    wrangler login
fi

# Database name
DB_NAME="kalenjin-books-db"

# Check if database already exists
echo -e "${YELLOW}🔍 Checking if database exists...${NC}"
if wrangler d1 list | grep -q "$DB_NAME"; then
    echo -e "${YELLOW}⚠️  Database '$DB_NAME' already exists.${NC}"
    read -p "Do you want to delete and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🗑️  Deleting existing database...${NC}"
        wrangler d1 delete "$DB_NAME" --skip-confirmation || true
    else
        echo -e "${GREEN}✅ Using existing database.${NC}"
        exit 0
    fi
fi

# Create D1 database
echo -e "${YELLOW}📦 Creating D1 database...${NC}"
DB_OUTPUT=$(wrangler d1 create "$DB_NAME")
echo "$DB_OUTPUT"

# Extract database ID from output
DB_ID=$(echo "$DB_OUTPUT" | grep -oP 'database_id = "\K[^"]+' || echo "")

if [ -z "$DB_ID" ]; then
    echo -e "${RED}❌ Failed to extract database ID. Please check the output above.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Database created with ID: $DB_ID${NC}"

# Update wrangler.toml
echo -e "${YELLOW}📝 Updating wrangler.toml...${NC}"
WRANGLER_FILE="wrangler.toml"

# Check if wrangler.toml exists
if [ ! -f "$WRANGLER_FILE" ]; then
    echo -e "${RED}❌ wrangler.toml not found!${NC}"
    exit 1
fi

# Update database_id in wrangler.toml
if grep -q "database_id = \"\"" "$WRANGLER_FILE"; then
    sed -i "s/database_id = \"\"/database_id = \"$DB_ID\"/" "$WRANGLER_FILE"
    echo -e "${GREEN}✅ Updated wrangler.toml with database ID${NC}"
else
    echo -e "${YELLOW}⚠️  Database ID already set in wrangler.toml${NC}"
fi

# Generate Prisma client
echo -e "${YELLOW}🔧 Generating Prisma client...${NC}"
npx prisma generate

# Create migration SQL
echo -e "${YELLOW}📋 Generating migration SQL...${NC}"
MIGRATION_DIR="prisma/migrations"
LATEST_MIGRATION=$(ls -t "$MIGRATION_DIR" | head -1)

if [ -z "$LATEST_MIGRATION" ]; then
    echo -e "${YELLOW}⚠️  No migrations found. Creating initial migration...${NC}"
    npx prisma migrate dev --name init --create-only
    LATEST_MIGRATION=$(ls -t "$MIGRATION_DIR" | head -1)
fi

MIGRATION_FILE="$MIGRATION_DIR/$LATEST_MIGRATION/migration.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo -e "${RED}❌ Migration file not found: $MIGRATION_FILE${NC}"
    exit 1
fi

# Apply migration to D1
echo -e "${YELLOW}🚀 Applying migrations to D1...${NC}"
wrangler d1 execute "$DB_NAME" --file="$MIGRATION_FILE"

echo -e "${GREEN}✅ Migrations applied successfully!${NC}"

# Verify database setup
echo -e "${YELLOW}🔍 Verifying database setup...${NC}"
wrangler d1 execute "$DB_NAME" --command="SELECT name FROM sqlite_master WHERE type='table';"

echo ""
echo -e "${GREEN}✅ D1 Database setup complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Run 'npm run cf:d1:seed' to seed initial data (optional)"
echo "2. Run 'npm run cf:dev' to test locally with Wrangler"
echo "3. Run 'npm run cf:deploy' to deploy to Cloudflare"
echo ""
echo -e "${YELLOW}📝 Database Details:${NC}"
echo "  Name: $DB_NAME"
echo "  ID: $DB_ID"
echo ""
