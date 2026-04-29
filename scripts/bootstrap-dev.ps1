$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $PSScriptRoot
$NodeMajorRequired = 20
$HostName = if ($env:HOST) { $env:HOST } else { "127.0.0.1" }
$Port = if ($env:PORT) { $env:PORT } else { "3000" }
$SkipQualityChecks = $env:SKIP_QUALITY_CHECKS -eq "1"

function Write-SetupLog {
  param([string]$Message)
  Write-Host ""
  Write-Host "[Sloka Sabha] $Message"
}

function Test-Command {
  param([string]$Name)
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Get-NodeMajorVersion {
  if (-not (Test-Command "node")) { return $null }
  $version = node -p "process.versions.node.split('.')[0]"
  if (-not $version) { return $null }
  return [int]$version
}

function Install-NodeWithWinget {
  Write-SetupLog "Installing Node.js 20 LTS with winget..."
  winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
}

function Install-NodeWithChoco {
  Write-SetupLog "Installing Node.js LTS with Chocolatey..."
  choco install nodejs-lts -y
}

function Ensure-Node {
  $major = Get-NodeMajorVersion
  if ($major -and $major -ge $NodeMajorRequired -and (Test-Command "npm")) {
    Write-SetupLog "Node.js $(node -v) already installed."
    return
  }

  if ($major) {
    Write-SetupLog "Found Node.js $(node -v), but ${NodeMajorRequired}+ is recommended."
  }

  if (Test-Command "winget") {
    Install-NodeWithWinget
  } elseif (Test-Command "choco") {
    Install-NodeWithChoco
  } else {
    throw "Unable to auto-install Node.js. Please install Node.js 20+ manually, then rerun this script."
  }

  $machineNodePath = "C:\Program Files\nodejs"
  if (Test-Path $machineNodePath) {
    $env:Path = "$machineNodePath;$env:Path"
  }

  if (-not (Test-Command "node") -or -not (Test-Command "npm")) {
    throw "Node.js installation did not become available in this shell. Open a new PowerShell window and rerun the script."
  }
}

Ensure-Node

Set-Location $RootDir

Write-SetupLog "Installing npm dependencies..."
npm ci

if (-not $SkipQualityChecks) {
  Write-SetupLog "Running lint and typecheck before starting..."
  npm run lint
  npm run typecheck
} else {
  Write-SetupLog "Skipping lint/typecheck because SKIP_QUALITY_CHECKS=1."
}

Write-SetupLog "Starting development server on http://${HostName}:$Port ..."
npm run dev -- --hostname $HostName --port $Port
