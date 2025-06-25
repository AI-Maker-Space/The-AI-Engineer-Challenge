#!/bin/bash

# Start FastAPI backend
cd api || exit 1
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Start Next.js frontend
cd frontend || exit 1
npm install
npm run dev

# When frontend stops, kill backend
kill $BACKEND_PID
cd ..

echo "Stopped FastAPI backend."