#!/bin/bash
# Script to renew SSL certificates and update the running application
# This script is intended to be run via cron (e.g., monthly)

set -e

# Configuration
APP_DIR=~/app
LOG_FILE=$APP_DIR/ssl-renewal.log
DOMAIN="christianity.nghood.com"

# Ensure we are in the correct directory
cd $APP_DIR

echo "------------------------------------------------" >> $LOG_FILE
echo "Starting SSL renewal process at $(date)" >> $LOG_FILE

# 1. Stop Nginx container to release port 80 (required for Certbot standalone mode)
# If your Certbot uses webroot mode, this step might not be strictly necessary, 
# but it avoids conflicts and ensures a clean state.
echo "Stopping Nginx container..." >> $LOG_FILE
if docker-compose stop nginx; then
    echo "Nginx stopped." >> $LOG_FILE
else
    echo "Warning: Failed to stop Nginx or it wasn't running." >> $LOG_FILE
fi

# 2. Run Certbot Renew
# --no-random-sleep-on-renew: Execute immediately (useful for manual runs/scripts)
echo "Running certbot renew..." >> $LOG_FILE
if sudo certbot renew --no-random-sleep-on-renew >> $LOG_FILE 2>&1; then
    echo "Certbot command finished." >> $LOG_FILE
else
    echo "Error: Certbot renewal failed." >> $LOG_FILE
    # Attempt to restart Nginx anyway to minimize downtime
    docker-compose start nginx
    exit 1
fi

# 3. Copy certificates to the application volume
# This ensures the Docker container sees the fresh certificates
LE_PATH="/etc/letsencrypt/live/$DOMAIN"

if [ -d "$LE_PATH" ]; then
    echo "Copying certificates from $LE_PATH..." >> $LOG_FILE
    
    # Ensure target directory exists
    mkdir -p $APP_DIR/nginx/ssl
    
    # Copy files
    sudo cp -L "$LE_PATH/fullchain.pem" "$APP_DIR/nginx/ssl/"
    sudo cp -L "$LE_PATH/privkey.pem" "$APP_DIR/nginx/ssl/"
    
    # Set permissions so Docker container can read them
    sudo chmod 644 "$APP_DIR/nginx/ssl/fullchain.pem"
    sudo chmod 644 "$APP_DIR/nginx/ssl/privkey.pem"
    
    echo "Certificates copied and permissions updated." >> $LOG_FILE
else
    echo "Error: Certificates not found at $LE_PATH" >> $LOG_FILE
fi

# 4. Start Nginx container to load the new certificates
echo "Starting Nginx container..." >> $LOG_FILE
if docker-compose start nginx; then
    echo "Nginx started successfully." >> $LOG_FILE
else
    echo "Error: Failed to start Nginx." >> $LOG_FILE
    exit 1
fi

echo "SSL renewal process completed at $(date)" >> $LOG_FILE
echo "------------------------------------------------" >> $LOG_FILE
