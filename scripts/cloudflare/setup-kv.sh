#!/bin/bash
# Cloudflare KV Namespace Setup Script
# Creates KV namespaces for caching and sessions

set -e

echo "🚀 Setting up Cloudflare KV Namespaces..."

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Create cache namespace
echo -e "${YELLOW}📦 Creating CACHE namespace...${NC}"
CACHE_OUTPUT=$(wrangler kv:namespace create "CACHE")
echo "$CACHE_OUTPUT"

CACHE_ID=$(echo "$CACHE_OUTPUT" | grep -oP 'id = "\K[^"]+' || echo "")

# Create session namespace
echo -e "${YELLOW}📦 Creating SESSION namespace...${NC}"
SESSION_OUTPUT=$(wrangler kv:namespace create "SESSION")
echo "$SESSION_OUTPUT"

SESSION_ID=$(echo "$SESSION_OUTPUT" | grep -oP 'id = "\K[^"]+' || echo "")

# Create preview namespaces for development
echo -e "${YELLOW}📦 Creating preview namespaces...${NC}"
CACHE_PREVIEW_OUTPUT=$(wrangler kv:namespace create "CACHE" --preview)
SESSION_PREVIEW_OUTPUT=$(wrangler kv:namespace create "SESSION" --preview)

echo ""
echo -e "${GREEN}✅ KV Namespaces created!${NC}"
echo ""
echo -e "${YELLOW}📝 Add these to your wrangler.toml:${NC}"
echo ""
echo "[[kv_namespaces]]"
echo "binding = \"CACHE\""
echo "id = \"$CACHE_ID\""
echo ""
echo "[[kv_namespaces]]"
echo "binding = \"SESSION\""
echo "id = \"$SESSION_ID\""
echo ""
