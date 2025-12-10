# Electron Desktop App Setup

## Install Electron
```bash
npm install --save-dev electron
npm install --save-dev electron-builder
```

## Create Electron Main Process
```javascript
// public/electron.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
```

## Package.json Scripts
```json
{
  "scripts": {
    "electron": "electron .",
    "electron-dev": "ELECTRON_IS_DEV=true electron .",
    "dist": "electron-builder",
    "pack": "electron-builder --dir"
  }
}
```