#!/bin/bash
set -e

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building application..."
npm run build

echo "✅ Build completed! Files are in the dist/ folder"

