# PowerShell helper to run backend & frontend locally
# Run this from the project root d:\project

# Backend
Write-Host "Starting backend..." -ForegroundColor Cyan
cd backend
if (-not (Test-Path ".venv")) {
    python -m venv .venv
}
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Start-Process -NoNewWindow -FilePath .\.venv\Scripts\python.exe -ArgumentList '-m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload'

# Frontend
$dd = Get-Location
cd ..\frontend
npm install
$env:VITE_API_URL = "http://localhost:8000"
Start-Process -NoNewWindow -FilePath npm -ArgumentList 'run','dev'

Write-Host "Local dev started (backend: 8000, frontend: 5173)" -ForegroundColor Green
