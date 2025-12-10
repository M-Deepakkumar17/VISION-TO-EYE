# Cordova Setup for Vision2Eye

## Install Cordova
```bash
npm install -g cordova
cordova create vision2eye-mobile com.vision2eye.app "Vision2Eye"
cd vision2eye-mobile
```

## Add Platforms
```bash
cordova platform add android
cordova platform add ios
```

## Copy Your Build
```bash
# Build React app first
npm run build

# Copy build files to Cordova www folder
cp -r build/* vision2eye-mobile/www/
```

## Build Native App
```bash
cordova build android
cordova run android
```

## Required Plugins
```bash
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-vibration
cordova plugin add cordova-plugin-sms
cordova plugin add cordova-plugin-call-number
```