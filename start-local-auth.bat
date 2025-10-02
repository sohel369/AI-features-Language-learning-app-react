@echo off
echo 🔐 Starting Local Authentication System
echo =====================================
echo.

echo 📦 Installing dependencies...
cd server
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 🚀 Starting authentication server...
echo Server will run on http://localhost:3001
echo.
echo 📝 Test the authentication:
echo 1. Open local-auth-test.html in your browser
echo 2. Or use the React component LocalAuthForm
echo.
echo Press Ctrl+C to stop the server
echo.

node auth.js



