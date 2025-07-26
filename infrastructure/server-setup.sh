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

# Install nginx
echo "=== Installing nginx ==="
sudo apt install nginx -y

# Install certbot
echo "=== Installing certbot ==="
sudo apt install software-properties-common -y
sudo add-apt-repository universe -y
sudo add-apt-repository ppa:certbot/certbot -y
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Create app directory
echo "=== Creating app directory ==="
mkdir -p ~/app

# Create docker-compose.yml
echo "=== Creating docker-compose.yml ==="
cat > ~/app/docker-compose.yml << 'EOF'
version: '3.8'
services:
  spring-backend:
    image: nghood/nghood-backend:latest
    ports:
      - "8080:8080"
    restart: unless-stopped
    environment:
      - DB_URL=jdbc:postgresql://postgres:5432/quizdb
      - DB_USERNAME=${DB_USERNAME:-dbuser}
      - DB_PASSWORD=${DB_PASSWORD:-dbpass}
      - API_SECRET=${API_SECRET:-prod-secret-456}
      - JPA_DDL_AUTO=update
    depends_on:
      - postgres
  
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=quizdb
      - POSTGRES_USER=${DB_USERNAME:-dbuser}
      - POSTGRES_PASSWORD=${DB_PASSWORD:-dbpass}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
EOF

# Configure nginx
echo "=== Configuring nginx ==="
sudo tee /etc/nginx/sites-available/api.nghood.com > /dev/null << 'EOF'
server {
    server_name api.nghood.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable nginx site
echo "=== Enabling nginx site ==="
sudo ln -sf /etc/nginx/sites-available/api.nghood.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate (requires DNS to be set up)
echo "=== Setting up SSL certificate ==="
if [ -z "$EMAIL" ]; then
    echo "WARNING: No EMAIL environment variable set. Skipping SSL setup."
    echo "Run: sudo certbot --nginx -d api.nghood.com --non-interactive --agree-tos -m your-email@example.com"
else
    sudo certbot --nginx -d api.nghood.com --non-interactive --agree-tos -m $EMAIL
fi

echo "=== Server setup complete! ==="
echo "Don't forget to:"
echo "1. Set up firewall rules in Lightsail console (ports 22, 80, 443, 8080)"
echo "2. Configure DNS A record for api.nghood.com"
echo "3. Set up SSL if not done: sudo certbot --nginx -d api.nghood.com --non-interactive --agree-tos -m your-email"
echo "4. Deploy the application via GitHub Actions"