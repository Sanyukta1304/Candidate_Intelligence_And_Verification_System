@echo off
REM CredVerify Frontend - Quick Setup Script (Windows)
REM This script sets up the frontend project quickly

echo 🚀 CredVerify Frontend Setup
echo ==============================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Visit: https://nodejs.org/
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ✅ .env file created
) else (
    echo ⚠️  .env file already exists
)

echo.
echo ==============================
echo ✨ Setup complete!
echo.
echo 📝 Available commands:
echo    npm run dev     - Start development server
echo    npm run build   - Build for production
echo    npm run preview - Preview production build
echo.
echo 🌐 Frontend will run at: http://localhost:3000
echo 🔗 Backend should run at: http://localhost:5000
echo.
echo To start developing:
echo    npm run dev
echo.

pause
