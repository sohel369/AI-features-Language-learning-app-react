#!/bin/bash
echo "Starting Language Learning App Backend Server..."
echo

cd server
echo "Installing dependencies..."
npm install

echo
echo "Starting server..."
node server.js
