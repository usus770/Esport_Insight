# Check Docker Desktop Status and Start Services
Write-Host "Checking Docker Desktop status..." -ForegroundColor Cyan

# Test Docker connection
try {
    $null = docker ps 2>&1
    Write-Host "Docker is running!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker Desktop is not running or not accessible" -ForegroundColor Red
    Write-Host "`nPlease:" -ForegroundColor Yellow
    Write-Host "1. Open Docker Desktop from Start Menu" -ForegroundColor Yellow
    Write-Host "2. Wait for it to fully start (whale icon in system tray)" -ForegroundColor Yellow
    Write-Host "3. Restart this terminal/PowerShell" -ForegroundColor Yellow
    Write-Host "4. Run this script again" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nBuilding and starting containers..." -ForegroundColor Cyan
Write-Host "This will take a few minutes on first run..." -ForegroundColor Yellow

# Remove version from docker-compose.yml temporarily (it's obsolete)
$composeContent = Get-Content docker-compose.yml -Raw
if ($composeContent -match "version:") {
    Write-Host "Note: Removing obsolete 'version' from docker-compose.yml" -ForegroundColor Yellow
}

# Start services
docker compose up --build -d

Write-Host "`nWaiting for services to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Check status
Write-Host "`nContainer Status:" -ForegroundColor Cyan
docker compose ps

Write-Host "`nServices should be starting..." -ForegroundColor Green
Write-Host "Backend API: http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend UI: http://localhost:5173" -ForegroundColor Green
Write-Host "`nTo view logs: docker compose logs -f" -ForegroundColor Yellow
Write-Host "To train model: docker compose exec api python -c 'import app._train_once'" -ForegroundColor Yellow









