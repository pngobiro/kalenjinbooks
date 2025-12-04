#!/bin/bash

echo "Installing AfriReads Tunnel as a system service..."

# Copy service file to systemd
sudo cp afrireads-tunnel.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable afrireads-tunnel.service

# Start the service
sudo systemctl start afrireads-tunnel.service

# Check status
sudo systemctl status afrireads-tunnel.service

echo ""
echo "✅ Service installed successfully!"
echo ""
echo "Useful commands:"
echo "  Start:   sudo systemctl start afrireads-tunnel"
echo "  Stop:    sudo systemctl stop afrireads-tunnel"
echo "  Restart: sudo systemctl restart afrireads-tunnel"
echo "  Status:  sudo systemctl status afrireads-tunnel"
echo "  Logs:    docker-compose -f docker-compose.tunnel.yml logs -f"
