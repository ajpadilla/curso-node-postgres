#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

echo "📦 Loading env from: $ENV_FILE"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Missing env file: $ENV_FILE"
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

# Validate required env vars
required_vars=(
  DB_USER
  DB_PASSWORD
  DB_NAME
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var:-}" ]; then
    echo "❌ Missing required environment variable: $var"
    exit 1
  fi
done

echo "🚀 Starting PostgreSQL setup..."

# 1️⃣ Install PostgreSQL if missing
if ! command -v psql &> /dev/null; then
  echo "📦 Installing PostgreSQL..."
  sudo apt update
  sudo apt install -y postgresql postgresql-contrib
else
  echo "✅ PostgreSQL already installed"
fi

# 2️⃣ Ensure PostgreSQL is running
echo "⚙️ Ensuring PostgreSQL is running..."

sudo systemctl enable postgresql
sudo systemctl start postgresql

if systemctl is-active --quiet postgresql; then
  echo "✅ PostgreSQL is running"
else
  echo "❌ PostgreSQL failed to start"
  exit 1
fi

# 3️⃣ Create database user if not exists
echo "👤 Checking database user..."

USER_EXISTS=$(
  sudo -u postgres psql -tAc \
  "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'"
)

if [ "$USER_EXISTS" = "1" ]; then
  echo "✅ User '$DB_USER' already exists"
else
  echo "➕ Creating user '$DB_USER'..."

  sudo -u postgres psql -c \
    "CREATE ROLE \"$DB_USER\" WITH LOGIN PASSWORD '$DB_PASSWORD';"

  echo "✅ User created"
fi

# 4️⃣ Create database if not exists
echo "🗄️ Checking database..."

DB_EXISTS=$(
  sudo -u postgres psql -tAc \
  "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'"
)

if [ "$DB_EXISTS" = "1" ]; then
  echo "✅ Database '$DB_NAME' already exists"
else
  echo "➕ Creating database '$DB_NAME'..."

  sudo -u postgres createdb \
    --owner="$DB_USER" \
    "$DB_NAME"

  echo "✅ Database created"
fi

# 5️⃣ Configure PostgreSQL to listen only locally
echo "🔒 Securing PostgreSQL config..."

PG_CONF=$(find /etc/postgresql -name postgresql.conf | head -n 1)

if [ -z "$PG_CONF" ]; then
  echo "❌ Could not find postgresql.conf"
  exit 1
fi

if grep -q "^#listen_addresses" "$PG_CONF"; then
  sudo sed -i \
    "s/^#listen_addresses.*/listen_addresses = 'localhost'/" \
    "$PG_CONF"
elif grep -q "^listen_addresses" "$PG_CONF"; then
  sudo sed -i \
    "s/^listen_addresses.*/listen_addresses = 'localhost'/" \
    "$PG_CONF"
else
  echo "listen_addresses = 'localhost'" \
    | sudo tee -a "$PG_CONF" > /dev/null
fi

# 6️⃣ Restart PostgreSQL
echo "🔄 Restarting PostgreSQL..."

sudo systemctl restart postgresql

if systemctl is-active --quiet postgresql; then
  echo "✅ PostgreSQL restarted successfully"
else
  echo "❌ PostgreSQL failed to restart"
  exit 1
fi

# 7️⃣ Configure firewall (UFW)
echo "🔥 Configuring firewall..."

if command -v ufw &> /dev/null; then
  sudo ufw allow 22/tcp
  sudo ufw allow 3000/tcp
  sudo ufw deny 5432/tcp || true
  sudo ufw --force enable

  echo "✅ Firewall configured"
else
  echo "⚠️ UFW not installed"
fi

echo ""
echo "🎉 PostgreSQL setup completed successfully"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Host: localhost"
echo "Port: 5432"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
