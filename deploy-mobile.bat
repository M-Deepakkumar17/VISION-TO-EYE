@echo off
REM Quick deployment script for Vision2Eye on Windows

echo 🚀 Building Vision2Eye for mobile deployment...

REM Build the app
call npm run build

echo 📱 Starting server accessible on your phone...
echo 🌐 Find your IP address and use port 8080
echo 📱 Example: http://192.168.1.100:8080
echo ⭐ Add to home screen for app-like experience!

REM Start server accessible from network
npx serve -s build -p 8080 --host 0.0.0.0