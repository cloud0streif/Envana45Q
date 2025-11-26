# Deployment Guide

## Local Development Setup

### Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- Poetry (optional but recommended)
- npm

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
# With Poetry
poetry install

# OR with pip
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -e .
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Run the server:
```bash
# With Poetry
poetry run uvicorn src.main:app --reload --port 8000

# OR with pip
uvicorn src.main:app --reload --port 8000
```

5. Verify at http://localhost:8000/docs

### Data Producer Setup

1. Navigate to data-producer directory:
```bash
cd data-producer
```

2. Install dependencies:
```bash
# With Poetry
poetry install

# OR with pip
python -m venv venv
source venv/bin/activate
pip install -e .
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Run the producer:
```bash
# With Poetry
poetry run python -m src.main

# OR with pip
python -m src.main
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Run the development server:
```bash
npm run dev
```

5. Open http://localhost:5173

## Docker Deployment

### Prerequisites

- Docker
- Docker Compose

### Running with Docker Compose

1. Build and start all services:
```bash
docker-compose up --build
```

This will start:
- Backend on port 8000
- Frontend on port 5173
- Data producer (no exposed port)

2. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/docs

3. Stop all services:
```bash
docker-compose down
```

### Individual Container Builds

**Backend:**
```bash
cd backend
docker build -t bme280-backend .
docker run -p 8000:8000 bme280-backend
```

**Data Producer:**
```bash
cd data-producer
docker build -t bme280-producer .
docker run --network host bme280-producer
```

**Frontend:**
```bash
cd frontend
docker build -t bme280-frontend .
docker run -p 5173:5173 bme280-frontend
```

## Production Deployment

### Environment Variables

**Backend (.env):**
```bash
HOST=0.0.0.0
PORT=8000
DEBUG=false
DATABASE_URL=sqlite+aiosqlite:///./sensor_data.db
CORS_ORIGINS=https://yourdomain.com
```

**Frontend (.env):**
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Database Considerations

For production, consider:
1. **PostgreSQL**: Better for concurrent writes
2. **TimescaleDB**: Optimized for time-series data
3. **Backups**: Regular database backups
4. **Migrations**: Use Alembic for schema changes

### Web Server

Use a production-grade server:

**With Gunicorn:**
```bash
pip install gunicorn
gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

**With systemd:**
```ini
[Unit]
Description=BME280 Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/opt/bme280/backend
ExecStart=/opt/bme280/backend/venv/bin/uvicorn src.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

### Reverse Proxy

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name yourdomain.com;

    root /opt/bme280/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### SSL/TLS

Use Let's Encrypt for free SSL certificates:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

## Cloud Deployment

### AWS

1. **EC2**: Deploy on t2.micro or larger
2. **RDS**: Use PostgreSQL for database
3. **S3 + CloudFront**: Host frontend static files
4. **ELB**: Load balance multiple backend instances

### Heroku

**Backend:**
```bash
# Add Procfile
echo "web: uvicorn src.main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
heroku create bme280-backend
git push heroku main
```

**Frontend:**
```bash
# Build and deploy
npm run build
# Use Netlify or Vercel for hosting
```

### DigitalOcean

1. Create Droplet (Ubuntu 22.04)
2. Install dependencies
3. Clone repository
4. Setup systemd services
5. Configure Nginx
6. Setup SSL with Let's Encrypt

## Monitoring & Maintenance

### Health Checks

Monitor these endpoints:
- Backend: `GET /api/v1/health`
- Expected response: `{"status": "healthy", "database": "connected"}`

### Logs

**Backend:**
```bash
# Development
tail -f backend.log

# Production (systemd)
journalctl -u bme280-backend -f
```

**Data Producer:**
```bash
journalctl -u bme280-producer -f
```

### Database Maintenance

**Backup:**
```bash
# SQLite
cp sensor_data.db sensor_data.db.backup

# PostgreSQL
pg_dump dbname > backup.sql
```

**Cleanup old data:**
```sql
DELETE FROM sensor_readings WHERE created_at < datetime('now', '-30 days');
VACUUM;
```

## Performance Tuning

### Backend

1. **Connection pooling**: Already configured via SQLAlchemy
2. **Async operations**: Already implemented
3. **Caching**: Add Redis for frequently accessed data

### Frontend

1. **Build optimization**:
```bash
npm run build
# Outputs to dist/ with optimized bundle
```

2. **CDN**: Host static files on CDN
3. **Lazy loading**: Already implemented with code splitting

### Database

1. **Indexes**: Already created on common query fields
2. **WAL mode**: Enabled for concurrent access
3. **VACUUM**: Run periodically to reclaim space

## Troubleshooting

### Backend won't start
- Check Python version: `python --version`
- Check dependencies: `poetry install`
- Check port availability: `lsof -i :8000`

### Data producer can't connect
- Verify backend is running
- Check `SERVER_URL` in `.env`
- Check firewall rules

### Frontend can't reach API
- Check `VITE_API_BASE_URL` in `.env`
- Check CORS settings in backend
- Check browser console for errors

### Database issues
- Check file permissions
- Check disk space
- Check for database locks
