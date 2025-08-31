#!/bin/bash

echo "🔄 Starting clean reinstall of lit-ui-library..."

# Step 1: Uninstall current library
echo "📦 Uninstalling current @vikunalabs/lit-ui-library..."
npm uninstall @vikunalabs/lit-ui-library

# Step 2: Clear npm cache
echo "🧹 Clearing npm cache..."
npm cache clean --force

# Step 3: Remove node_modules and package-lock.json for clean slate
echo "🗑️  Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

# Step 4: Fresh npm install
echo "📥 Running fresh npm install..."
npm install

# Step 5: Reinstall updated library
echo "🔧 Installing updated @vikunalabs/lit-ui-library..."
npm install file:/home/vikunalabs/workspace/projects/@vikunalabs/lit-ui-library

# Step 6: Test build
echo "🏗️  Testing build..."
npm run build

echo "✅ Clean reinstall completed!"