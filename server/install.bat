@echo off
echo 🚀 Setting up Language App Backend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy env.example .env
    echo ✅ .env file created. Please edit it with your MongoDB URI.
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Backend setup complete!
echo.
echo Next steps:
echo 1. Edit .env file with your MongoDB URI
echo 2. Start MongoDB service
echo 3. Run: npm start
echo.
echo The server will run on http://localhost:5000
pause
