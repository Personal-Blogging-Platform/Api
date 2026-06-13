#!/bin/bash

## 
# This script initializes a new Node.js project by creating the standard folder structure
# and boilerplate files.
# 
# Usage: 
#   - Navigate to your project directory
#   - Run: chmod +x scripts/init.bash (one time)
#   - Run: ./scripts/init.bash 
##

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting project initialization..."

# 1. Check if we are in a Git repository. If not, initialize one.
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "No Git repository detected. Initializing a new Git repository..."
  git init
fi

# 2. Get the absolute path to the root of the Git repository
GIT_ROOT=$(git rev-parse --show-toplevel)
echo "Project root set to: $GIT_ROOT"

# 3. Define the exact folder structure arrays
DIRECTORIES=(
  "src/config"
  "src/controllers"
  "src/middlewares"
  "src/models"
  "src/repositories/interfaces"
  "src/routes"
  "src/services"
  "src/utils"
  "docs"
)

# 4. Loop through the array, create directories, and add .gitkeep
for DIR in "${DIRECTORIES[@]}"; do
  TARGET_DIR="$GIT_ROOT/$DIR"
  mkdir -p "$TARGET_DIR"
  touch "$TARGET_DIR/.gitkeep"
  echo "Created: $DIR/ (with .gitkeep)"
done

# 5. Create the boilerplate files we mapped out earlier
touch "$GIT_ROOT/.env.example"
touch "$GIT_ROOT/docker-compose.yml"
touch "$GIT_ROOT/Dockerfile"
touch "$GIT_ROOT/README.md"
touch "$GIT_ROOT/src/app.ts"
touch "$GIT_ROOT/src/server.ts"

echo "Boilerplate files created."
echo "✅ Project hierarchy successfully initialized at $GIT_ROOT!"