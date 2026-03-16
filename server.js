const express = require('express');
const path = require('path');
const fs = require('fs');

const port = 8080;
const app = express();

const USERS_FILE = path.join(__dirname, 'database', 'users.json');

app.use(express.json());
app.use('/acesso', express.static(path.join(__dirname, 'ACESSO')));
app.use('/ofuscador', express.static(path.join(__dirname, 'OFUSCADOR')));

// --- USERS API ---
function readUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) return {};
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch (e) { return {}; }
}

function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.get('/api/users', (req, res) => {
    res.json(readUsers());
});

app.post('/api/users', (req, res) => {
    const { email, password, expiry } = req.body;
    if (!email || !password || !expiry) return res.status(400).json({ error: 'Dados incompletos' });
    
    const users = readUsers();
    users[email.toLowerCase()] = { password, expiry };
    writeUsers(users);
    res.json({ success: true });
});

app.delete('/api/users/:email', (req, res) => {
    const email = req.params.email.toLowerCase();
    const users = readUsers();
    if (users[email]) {
        delete users[email];
        writeUsers(users);
    }
    res.json({ success: true });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    const user = users[email?.toLowerCase()];
    
    if (user && user.password === password) {
        if (Date.now() > user.expiry) {
            return res.status(403).json({ error: 'Acesso expirado' });
        }
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Email ou senha inválidos' });
    }
});

// Redirect root to ofuscador for convenience
app.get('/', (req, res) => {
    res.redirect('/ofuscador');
});

app.listen(port, () => {
    console.log(`🚀 [GL DEV] Servidor online!`);
    console.log(`➡️  ACESSO:    http://localhost:${port}/acesso`);
    console.log(`➡️  OFUSCADOR: http://localhost:${port}/ofuscador`);
});
