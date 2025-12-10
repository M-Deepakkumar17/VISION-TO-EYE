const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

// Enhanced database connection with error handling
const db = new sqlite3.Database('./vision2eye.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database successfully');
  }
});

app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    status: 'Backend server is working!', 
    timestamp: new Date().toISOString(),
    endpoints: {
      notes: '/notes',
      family: '/contacts/family', 
      helplines: '/contacts/helplines'
    }
  });
});

// Create notes table if not exists
db.run('CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)', (err) => {
  if (err) console.error('Table creation error:', err.message);
});

// Lightweight tables for other modules
db.run('CREATE TABLE IF NOT EXISTS calls (id INTEGER PRIMARY KEY AUTOINCREMENT, number TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)', (err) => {
  if (err) console.error('Table creation error:', err.message);
});
db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, recipient TEXT, body TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)', (err) => {
  if (err) console.error('Table creation error:', err.message);
});
db.run('CREATE TABLE IF NOT EXISTS sos_events (id INTEGER PRIMARY KEY AUTOINCREMENT, lat REAL, lng REAL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)', (err) => {
  if (err) console.error('Table creation error:', err.message);
});
db.run('CREATE TABLE IF NOT EXISTS searches (id INTEGER PRIMARY KEY AUTOINCREMENT, query TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)', (err) => {
  if (err) console.error('Table creation error:', err.message);
});
db.run('CREATE TABLE IF NOT EXISTS photos (id INTEGER PRIMARY KEY AUTOINCREMENT, data_url TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)', (err) => {
  if (err) console.error('Table creation error:', err.message);
});
db.run('CREATE TABLE IF NOT EXISTS family_contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, number TEXT)', (err) => {
  if (err) console.error('Table creation error:', err.message);
});
db.run('CREATE TABLE IF NOT EXISTS helplines (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, number TEXT)', (err) => {
  if (err) console.error('Table creation error:', err.message);
});



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

// Contacts: record a call attempt
app.post('/contacts/call', (req, res) => {
  const { number } = req.body;
  db.run('INSERT INTO calls(number) VALUES(?)', [number || ''], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// SMS: record a sent message
app.post('/sms/send', (req, res) => {
  const { to, message } = req.body;
  db.run('INSERT INTO messages(recipient, body) VALUES(?,?)', [to || '', message || ''], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// SOS: record location
app.post('/sos', (req, res) => {
  const { lat, lng } = req.body;
  db.run('INSERT INTO sos_events(lat, lng) VALUES(?,?)', [lat, lng], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Entertainment: record YouTube searches
app.post('/entertainment/search', (req, res) => {
  const { query } = req.body;
  db.run('INSERT INTO searches(query) VALUES(?)', [query || ''], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Camera: store a snapshot data URL (optional, for demo)
app.post('/camera/photo', (req, res) => {
  const { dataUrl } = req.body;
  db.run('INSERT INTO photos(data_url) VALUES(?)', [dataUrl || ''], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Family contacts endpoints
app.get('/contacts/family', (req, res) => {
  db.all('SELECT * FROM family_contacts ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.post('/contacts/family', (req, res) => {
  const { name, number } = req.body;
  db.run('INSERT INTO family_contacts(name, number) VALUES(?,?)', [name || '', number || ''], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});
app.delete('/contacts/family/:id', (req, res) => {
  db.run('DELETE FROM family_contacts WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Helplines endpoints
app.get('/contacts/helplines', (req, res) => {
  db.all('SELECT * FROM helplines ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.post('/contacts/helplines', (req, res) => {
  const { name, number } = req.body;
  db.run('INSERT INTO helplines(name, number) VALUES(?,?)', [name || '', number || ''], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});
app.delete('/contacts/helplines/:id', (req, res) => {
  db.run('DELETE FROM helplines WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});



const PORT = process.env.PORT || 5000;

// Serve React build in production
const path = require('path');
const buildPath = path.join(__dirname, 'build');
if (require('fs').existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(PORT, (err) => {
  if (err) {
    console.error('Server failed to start:', err);
  } else {
    console.log(`✅ Vision2Eye Server running on port ${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`🔗 Family contacts: http://localhost:${PORT}/contacts/family`);
    console.log(`🔗 Notes: http://localhost:${PORT}/notes`);
  }
});
