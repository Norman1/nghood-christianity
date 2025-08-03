#!/bin/bash
# Server setup script for Lightsail Ubuntu instance
# Run this once when setting up a new server

set -e  # Exit on error

echo "=== Starting server setup ==="

# Update system
echo "=== Updating system packages ==="
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "=== Installing Docker ==="
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
else
    echo "Docker already installed"
fi

# Install Docker Compose
echo "=== Installing Docker Compose ==="
if ! command -v docker-compose &> /dev/null; then
    sudo apt install docker-compose -y
else
    echo "Docker Compose already installed"
fi

# Note: Nginx will run in Docker, so we don't need to install it on the host
# We'll handle SSL with Let's Encrypt inside the container or via a reverse proxy

# Create app directory structure
echo "=== Creating app directory structure ==="
mkdir -p ~/app
mkdir -p ~/app/frontend
mkdir -p ~/app/nginx/ssl
mkdir -p ~/app/backend/data

# Copy docker-compose.yml from repository
echo "=== Creating docker-compose.yml ==="
cat > ~/app/docker-compose.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=${POSTGRES_DB:-quizdb}
      - POSTGRES_USER=${DB_USERNAME:-dbuser}
      - POSTGRES_PASSWORD=${DB_PASSWORD:-dbpass}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME:-dbuser} -d ${POSTGRES_DB:-quizdb}"]
      interval: 10s
      timeout: 5s
      retries: 5

  spring-backend:
    image: ${DOCKER_IMAGE:-nghood/nghood-backend:latest}
    environment:
      - DB_URL=jdbc:postgresql://postgres:5432/${POSTGRES_DB:-quizdb}
      - DB_USERNAME=${DB_USERNAME:-dbuser}
      - DB_PASSWORD=${DB_PASSWORD:-dbpass}
      - API_SECRET=${API_SECRET:-prod-secret-456}
      - JPA_DDL_AUTO=${JPA_DDL_AUTO:-update}
      - JPA_SHOW_SQL=${JPA_SHOW_SQL:-false}
      - DATA_PATH=/app/data/
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend/data:/app/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "${NGINX_PORT:-80}:80"
      - "${NGINX_SSL_PORT:-443}:443"
    volumes:
      - ${FRONTEND_PATH:-./frontend}:/usr/share/nginx/html:ro
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ${SSL_CERTS:-./nginx/ssl}:/etc/nginx/ssl:ro
    depends_on:
      - spring-backend
    restart: unless-stopped

volumes:
  postgres_data:
EOF

# Create nginx configuration file
echo "=== Creating nginx configuration ==="
cat > ~/app/nginx/nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost christianity.nghood.com;
    
    # Frontend root directory
    root /usr/share/nginx/html;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Serve static assets with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Proxy API requests to Spring Boot backend
    location /api/ {
        proxy_pass http://spring-backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Don't cache API responses
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
    
    # Proxy actuator endpoints (health checks)
    location /actuator/ {
        proxy_pass http://spring-backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Handle client-side routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json;
    gzip_disable "MSIE [1-6]\.";
}
EOF

# Create production .env file
echo "=== Creating production .env file ==="
cat > ~/app/.env << 'EOF'
# Production Environment
POSTGRES_DB=quizdb
DB_USERNAME=produser
DB_PASSWORD=CHANGE_ME_TO_SECURE_PASSWORD

# API
API_SECRET=prod-secret-456

# Spring settings
JPA_DDL_AUTO=update
JPA_SHOW_SQL=false

# Frontend path
FRONTEND_PATH=./frontend

# Docker image
DOCKER_IMAGE=nghood/nghood-backend:latest

# SSL (uncomment when SSL is set up)
# NGINX_SSL_PORT=443
# SSL_CERTS=./nginx/ssl
EOF

echo "=== Server setup complete! ==="
echo "Don't forget to:"
echo "1. Edit ~/app/.env and set secure database password"
echo "2. Set up firewall rules in Lightsail console (ports 22, 80, 443)"
echo "3. Configure DNS A record for christianity.nghood.com to point to this server"
echo "4. Deploy frontend files to ~/app/frontend"
echo "5. Set up SSL certificates (manual process with Let's Encrypt)"
echo "6. Deploy the application via GitHub Actions"