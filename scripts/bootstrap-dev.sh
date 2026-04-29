#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_MAJOR_REQUIRED=20
HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-3000}"
SKIP_QUALITY_CHECKS="${SKIP_QUALITY_CHECKS:-0}"

log() {
  printf '\n[%s] %s\n' "Sloka Sabha" "$1"
}

has_command() {
  command -v "$1" >/dev/null 2>&1
}

install_node_with_brew() {
  log "Installing Node.js with Homebrew..."
  brew install node@20
  if [ -d "/opt/homebrew/opt/node@20/bin" ]; then
    export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
  elif [ -d "/usr/local/opt/node@20/bin" ]; then
    export PATH="/usr/local/opt/node@20/bin:$PATH"
  fi
}

install_node_with_apt() {
  log "Installing Node.js 20 with apt..."
  sudo apt-get update
  sudo apt-get install -y ca-certificates curl gnupg
  if [ ! -f /etc/apt/keyrings/nodesource.gpg ]; then
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
  fi
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list >/dev/null
  sudo apt-get update
  sudo apt-get install -y nodejs
}

install_node_with_dnf() {
  log "Installing Node.js 20 with dnf..."
  sudo dnf install -y nodejs
}

install_node_with_pacman() {
  log "Installing Node.js and npm with pacman..."
  sudo pacman -Sy --noconfirm nodejs npm
}

ensure_node() {
  if has_command node && has_command npm; then
    local major
    major="$(node -p "process.versions.node.split('.')[0]")"
    if [ "$major" -ge "$NODE_MAJOR_REQUIRED" ]; then
      log "Node.js $(node -v) already installed."
      return
    fi
    log "Found Node.js $(node -v), but ${NODE_MAJOR_REQUIRED}+ is recommended."
  fi

  if has_command brew; then
    install_node_with_brew
  elif has_command apt-get; then
    install_node_with_apt
  elif has_command dnf; then
    install_node_with_dnf
  elif has_command pacman; then
    install_node_with_pacman
  else
    cat <<'EOF'
Unable to auto-install Node.js because no supported package manager was found.
Please install Node.js 20+ and npm manually, then rerun this script.
EOF
    exit 1
  fi
}

ensure_node

log "Installing npm dependencies..."
cd "$ROOT_DIR"
npm ci

if [ "$SKIP_QUALITY_CHECKS" != "1" ]; then
  log "Running lint and typecheck before starting..."
  npm run lint
  npm run typecheck
else
  log "Skipping lint/typecheck because SKIP_QUALITY_CHECKS=1."
fi

log "Starting development server on http://${HOST}:${PORT} ..."
npm run dev -- --hostname "$HOST" --port "$PORT"
