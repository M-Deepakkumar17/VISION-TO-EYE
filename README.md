# Vision2Eye Web Application

## Project Overview
Vision2Eye is a React-based web application designed for visually impaired users, featuring voice-based modules for battery status, contacts, notes, settings, SMS, emergency SOS, camera, and entertainment.

## Features
- Voice-based accessibility for all modules
- Modular design for easy navigation
- Modern UI with accessibility in mind
- SQLite integration for local data storage

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- Python (for SQLite server, if needed)
__
## Installation
1. Open a terminal in the `vision2eye` directory:
   ```powershell
   cd d:\agileproject\vision2eye
   ```
2. Install dependencies (frontend + backend):
   ```powershell
   npm install
   ```

### Development (recommended)
This runs the React development server with hot reload and the backend separately.

1. Start the backend API in one terminal:
   ```powershell
   npm run start:server
   ```
   Backend listens on port 5000 by default.

2. Start the frontend in another terminal:
   ```powershell
   npm start
   ```
   Frontend dev server runs on port 3000. Open `http://localhost:3000` in your browser.

### Production (single process)
Build the frontend and serve it together with the backend (Express will serve the `build` folder):

1. Build the React app:
   ```powershell
   npm run build
   ```
2. Start the combined server:
   ```powershell
   npm run start:prod
   ```
   Then open `http://localhost:5000` to view the site.

### SQLite Usage
- The app can connect to a local SQLite database using Node.js (backend required).
- Example backend code is provided in `server.js` (create this file if needed).

## Example Node.js Backend (`server.js`)
```js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./vision2eye.db');

app.use(express.json());

app.get('/notes', (req, res) => {
  db.all('SELECT * FROM notes', [], (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.post('/notes', (req, res) => {
  const { text } = req.body;
  db.run('INSERT INTO notes(text) VALUES(?)', [text], function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({ id: this.lastID });
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));
```

## Notes
- For full SQLite support, you need a Node.js backend.
- Frontend communicates with backend via HTTP requests.
- Modify and expand backend as needed for other modules.

---
