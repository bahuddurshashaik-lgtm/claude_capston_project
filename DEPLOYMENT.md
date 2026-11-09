# Deployment Guide - HB-001: Hotel Search and Browse

## Overview

This guide covers deploying the Hotel Search and Browse API (HB-001) to production.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ running
- Database credentials
- Server/hosting environment (VPS, cloud, etc.)

## Pre-Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] Test coverage ≥ 80%
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Seed data prepared
- [ ] Security headers configured
- [ ] Rate limiting tested
- [ ] CORS origins configured
- [ ] Logging configured

## Environment Configuration

### 1. Create Production .env File

```bash
# Server Configuration
NODE_ENV=production
PORT=3000

# Database Configuration (use strong passwords in production!)
DATABASE_URL=postgresql://hotel_app:STRONG_PASSWORD@db-host:5432/hotel_booking
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=50

# Security Configuration
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Logging Configuration
LOG_LEVEL=warn
```

### 2. Secure Secrets

**Never commit production credentials to git!**

Options for managing secrets:
- Environment variables (server configuration)
- Secret management service (AWS Secrets Manager, HashiCorp Vault)
- `.env` file with restricted permissions (chmod 600)

## Database Setup

### 1. Production Database Creation

```bash
# Connect to PostgreSQL
psql -h your-db-host -U postgres

# Create production database
CREATE DATABASE hotel_booking;

# Create dedicated user with strong password
CREATE USER hotel_app WITH PASSWORD 'STRONG_RANDOM_PASSWORD';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE hotel_booking TO hotel_app;

# Exit
\q
```

### 2. Run Migrations

```bash
# On production server
NODE_ENV=production npm run migrate:latest

# Verify
psql -h your-db-host -U hotel_app -d hotel_booking -c "\dt"
```

### 3. Seed Production Data

**Important**: Use production-appropriate seed data, not test data!

```bash
# Create production seed file if needed
npm run seed:make production_hotels

# Run seeds
NODE_ENV=production npm run seed:run
```

## Deployment Options

### Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)

#### Step 1: Install Dependencies

```bash
# Clone repository
git clone https://github.com/yourorg/hotel-booking-system.git
cd hotel-booking-system

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
npm install --production
```

#### Step 2: Configure Process Manager (PM2)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start src/server.js --name hotel-api

# Configure auto-restart on system reboot
pm2 startup
pm2 save
```

#### Step 3: Configure Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Step 4: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal (certbot adds this automatically)
sudo certbot renew --dry-run
```

### Option 2: Docker Deployment

#### Dockerfile

```dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "src/server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://hotel_app:password@db:5432/hotel_booking
      RATE_LIMIT_WINDOW_MS: 60000
      RATE_LIMIT_MAX_REQUESTS: 100
    depends_on:
      - db
    restart: unless-stopped
  
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: hotel_booking
      POSTGRES_USER: hotel_app
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

#### Deploy with Docker

```bash
# Build and start
docker-compose up -d

# Run migrations
docker-compose exec api npm run migrate:latest

# Run seeds
docker-compose exec api npm run seed:run

# View logs
docker-compose logs -f api
```

### Option 3: Cloud Platform (Heroku, Railway, Render)

#### Heroku Example

```bash
# Install Heroku CLI
brew install heroku/brew/heroku  # macOS
# or download from https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create hotel-booking-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set RATE_LIMIT_MAX_REQUESTS=100
heroku config:set LOG_LEVEL=info

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate:latest

# Run seeds
heroku run npm run seed:run

# View logs
heroku logs --tail
```

#### Procfile (for Heroku)

```
web: node src/server.js
```

## Post-Deployment Verification

### 1. Health Check

```bash
curl https://api.yourdomain.com/health

# Expected response:
# {"status":"ok","timestamp":"2026-11-09T10:00:00.000Z"}
```

### 2. API Endpoints

```bash
# Test search endpoint
curl "https://api.yourdomain.com/api/v1/hotels/search?location=Miami"

# Test hotel details
curl "https://api.yourdomain.com/api/v1/hotels/1"
```

### 3. Rate Limiting

```bash
# Make 101 requests rapidly
for i in {1..101}; do
  curl -s "https://api.yourdomain.com/api/v1/hotels/search?location=Miami"
done

# Last request should return 429 Too Many Requests
```

### 4. CORS

```bash
# Test CORS headers
curl -H "Origin: https://yourdomain.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://api.yourdomain.com/api/v1/hotels/search
```

### 5. Database Connection

```bash
# Check database connectivity
psql -h your-db-host -U hotel_app -d hotel_booking -c "SELECT COUNT(*) FROM hotels;"
```

## Monitoring

### Application Monitoring

#### PM2 Monitoring

```bash
# View app status
pm2 status

# View logs
pm2 logs hotel-api

# Monitor resources
pm2 monit
```

#### Log Management

Logs are written to:
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs

Configure log rotation:

```bash
# Install logrotate
sudo apt-get install logrotate

# Create logrotate config
sudo nano /etc/logrotate.d/hotel-api
```

```
/path/to/app/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 app app
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### Database Monitoring

```sql
-- Check slow queries
SELECT * FROM pg_stat_statements 
ORDER BY total_exec_time DESC 
LIMIT 10;

-- Check index usage
SELECT * FROM pg_stat_user_indexes 
WHERE schemaname = 'public';

-- Check table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Performance Tuning

### 1. Database Connection Pooling

Already configured in `src/config/database.js`:
- Min connections: 5
- Max connections: 50

Adjust based on your server resources and load.

### 2. PostgreSQL Configuration

For production, tune PostgreSQL settings in `postgresql.conf`:

```conf
# Memory settings (adjust based on server RAM)
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 128MB

# Query optimization
random_page_cost = 1.1
effective_io_concurrency = 200

# Logging
log_min_duration_statement = 1000  # Log queries > 1 second
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```

### 3. Nginx Caching (Optional)

Cache API responses in Nginx:

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

server {
    location /api/v1/hotels/search {
        proxy_cache api_cache;
        proxy_cache_valid 200 5m;
        proxy_cache_key "$scheme$request_method$host$request_uri";
        add_header X-Cache-Status $upstream_cache_status;
        
        proxy_pass http://localhost:3000;
    }
}
```

## Backup and Recovery

### Database Backups

#### Automated Daily Backups

```bash
#!/bin/bash
# /usr/local/bin/backup-db.sh

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/backups/postgresql"
DB_NAME="hotel_booking"

# Create backup
pg_dump -h localhost -U hotel_app -F c -b -v -f "${BACKUP_DIR}/${DB_NAME}_${DATE}.backup" ${DB_NAME}

# Delete backups older than 30 days
find ${BACKUP_DIR} -name "*.backup" -mtime +30 -delete
```

#### Cron Job

```bash
# Add to crontab
crontab -e

# Run daily at 2 AM
0 2 * * * /usr/local/bin/backup-db.sh
```

#### Restore from Backup

```bash
pg_restore -h localhost -U hotel_app -d hotel_booking -v /backups/postgresql/hotel_booking_2026-11-09.backup
```

## Security Checklist

- [ ] Use HTTPS (SSL/TLS) in production
- [ ] Strong database passwords
- [ ] Environment variables secured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers (Helmet.js)
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization)
- [ ] Database user has minimum required privileges
- [ ] Firewall rules configured (only allow necessary ports)
- [ ] Keep dependencies updated (`npm audit`)
- [ ] Regular security patches

## Scaling

### Horizontal Scaling

Run multiple instances behind a load balancer:

```
                 ┌────────────┐
                 │   Nginx    │
                 │Load Balancer│
                 └─────┬──────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
   │ Node.js │    │ Node.js │    │ Node.js │
   │Instance1│    │Instance2│    │Instance3│
   └────┬────┘    └────┬────┘    └────┬────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
                 ┌─────▼──────┐
                 │ PostgreSQL │
                 │  Primary   │
                 └────────────┘
```

### Database Scaling

For high read load:
1. **Read Replicas**: Set up PostgreSQL streaming replication
2. **Read/Write Split**: Direct searches to replicas, writes to primary
3. **Connection Pooling**: Use PgBouncer for connection management

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs hotel-api --lines 100

# Common issues:
# - Database connection failed → Check DATABASE_URL
# - Port already in use → Change PORT or kill process on port 3000
# - Module not found → Run npm install
```

### Slow Queries

```bash
# Enable slow query logging in PostgreSQL
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();

# Check logs
tail -f /var/log/postgresql/postgresql-14-main.log
```

### High Memory Usage

```bash
# Check Node.js memory
pm2 list

# Restart if needed
pm2 restart hotel-api

# Check database connections
psql -c "SELECT count(*) FROM pg_stat_activity;"
```

## Rollback Plan

### Rolling Back Code

```bash
# Revert to previous version
git revert HEAD
git push heroku main

# Or roll back to specific commit
git reset --hard <commit-hash>
git push -f heroku main
```

### Rolling Back Database

```bash
# Rollback last migration
npm run migrate:rollback

# Rollback all migrations
npm run migrate:rollback --all
```

## Support

### Logs Location

- Application logs: `logs/` directory
- PM2 logs: `~/.pm2/logs/`
- PostgreSQL logs: `/var/log/postgresql/`
- Nginx logs: `/var/log/nginx/`

### Useful Commands

```bash
# Check app status
pm2 status

# Restart app
pm2 restart hotel-api

# View real-time logs
pm2 logs hotel-api --lines 100

# Check database
psql -h localhost -U hotel_app -d hotel_booking

# Test API
curl https://api.yourdomain.com/health
```

---

## Summary

After deployment:
1. ✅ Application running on port 3000
2. ✅ Database migrations applied
3. ✅ SSL certificate installed
4. ✅ Monitoring configured
5. ✅ Backups scheduled
6. ✅ Health check passing
7. ✅ API endpoints functional
8. ✅ Rate limiting active
9. ✅ Logs rotating properly
10. ✅ Security hardened

**API is ready for production traffic! 🚀**
