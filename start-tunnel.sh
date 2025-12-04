#!/bin/bash

# Start Cloudflare Tunnel for AfriReads
echo "Starting AfriReads Cloudflare Tunnel..."

# Load environment variables
export $(cat .env.tunnel | xargs)

# Start the tunnel with docker-compose
docker-compose -f docker-compose.tunnel.yml up -d

echo "✅ AfriReads tunnel started successfully!"
echo "Check status: docker-compose -f docker-compose.tunnel.yml ps"
echo "View logs: docker-compose -f docker-compose.tunnel.yml logs -f"
