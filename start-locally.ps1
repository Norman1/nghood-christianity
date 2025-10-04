Param(
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Warn {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

$scriptRoot = Split-Path -Path $PSCommandPath -Parent
Set-Location $scriptRoot

$composeFile = Join-Path $scriptRoot 'docker-compose.local.yml'
if (-not (Test-Path $composeFile)) {
    throw "Could not find docker-compose.local.yml in $scriptRoot"
}

if (Get-Command 'docker-compose' -ErrorAction SilentlyContinue) {
    $composeCommand = 'docker-compose'
    $composeArgsBase = @('-f', $composeFile)
} elseif (Get-Command 'docker' -ErrorAction SilentlyContinue) {
    $composeCommand = 'docker'
    $composeArgsBase = @('compose', '-f', $composeFile)
} else {
    throw 'Docker is not available on PATH. Please install Docker Desktop and reopen PowerShell.'
}

function Invoke-Compose {
    param(
        [string[]]$Args
    )
    & $composeCommand @($composeArgsBase + $Args) | Out-Null
}

Write-Info 'Stopping any existing local stack to ensure a clean start'
try {
    Invoke-Compose -Args @('down')
} catch {
    Write-Warn "Stopping existing containers failed: $($_.Exception.Message)"
}

Write-Info "Starting local stack using $composeFile"
Invoke-Compose -Args @('up', '--build', '-d')
Write-Info 'Containers are starting in the background.'
Write-Info 'Backend may take a short while before the site responds.'

if (-not $NoBrowser) {
    Write-Info 'Opening browser at http://localhost/'
    Start-Process 'http://localhost/' | Out-Null
} else {
    Write-Info 'Skipping browser launch (NoBrowser switch provided).'
}

Write-Info 'Tail logs with: docker-compose -f docker-compose.local.yml logs -f'
Write-Info 'Shut down with: docker-compose -f docker-compose.local.yml down'
