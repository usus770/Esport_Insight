# EsportInsight Startup Script
Write-Host "EsportInsight - Dota 2 MVP" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if Docker is available
try {
    $dockerVersion = docker --version 2>&1
    Write-Host "Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
OPENDOTA_BASE=https://api.opendota.com/api
CACHE_DIR=/data/cache
"@ | Out-File -FilePath .env -Encoding utf8
    Write-Host ".env file created" -ForegroundColor Green
} else {
    Write-Host ".env file exists" -ForegroundColor Green
}

# Check if containers are already running
$containers = docker compose ps --format json 2>&1 | ConvertFrom-Json
if ($containers.Count -gt 0) {
    Write-Host "Containers are already running. Stopping them first..." -ForegroundColor Yellow
    docker compose down
}

Write-Host "`nBuilding and starting containers..." -ForegroundColor Cyan
Write-Host "This may take a few minutes on first run..." -ForegroundColor Yellow
Write-Host "`nBackend API will be at: http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend UI will be at: http://localhost:5173" -ForegroundColor Green
Write-Host "`nPress Ctrl+C to stop the services`n" -ForegroundColor Yellow

# Start the services
docker compose up --build










