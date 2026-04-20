#!/bin/bash
set -e

cd /Users/michaeldoran/dev/The-AI-Engineer-Challenge

echo "=== Checking git status ==="
git status --short

echo ""
echo "=== Adding all changes ==="
git add -A

echo ""
echo "=== Committing changes ==="
git commit -m "Update ChatInterface to use NEXT_PUBLIC_BACKEND_URL environment variable

- Add API_BASE_URL configuration from environment
- Add error handling for missing NEXT_PUBLIC_BACKEND_URL
- Improve backend URL configuration"

echo ""
echo "=== Pushing to develop ==="
git push origin develop

echo ""
echo "=== Switching to main ==="
git checkout main

echo ""
echo "=== Pulling latest from main ==="
git pull origin main

echo ""
echo "=== Merging develop into main ==="
git merge develop --no-edit

echo ""
echo "=== Pushing to main ==="
git push origin main

echo ""
echo "=== Switching back to develop ==="
git checkout develop

echo ""
echo "=== Final status ==="
git status

echo ""
echo "✅ All done!"

