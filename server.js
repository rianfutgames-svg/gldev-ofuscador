const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const port = process.env.PORT || 8080;
const app = express();

// --- CONFIG ---
app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, 'database', 'users.json');
const SITE_TYPE = process.env.SITE_TYPE; // 'OFUSCADOR' or 'ACESSO'

// In Render, you will set SITE_TYPE as an environment variable for each deploy.
if (SITE_TYPE === 'OFUSCADOR') {
    app.use(express.static(path.join(__dirname, 'OFUSCADOR')));
} else if (SITE_TYPE === 'ACESSO') {
    app.use(express.static(path.join(__dirname, 'ACESSO')));
} else {
    // Local / Default: both
    app.use('/acesso', express.static(path.join(__dirname, 'ACESSO')));
    app.use('/ofuscador', express.static(path.join(__dirname, 'OFUSCADOR')));
    app.get('/', (req, res) => res.redirect('/ofuscador'));
}

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
    if (!email) return res.status(400).json({ error: 'Dados incompletos' });
    
    const users = readUsers();
    users[email.toLowerCase()] = { 
        password: password || (users[email.toLowerCase()]?.password || ''), 
        expiry: expiry || (users[email.toLowerCase()]?.expiry || (Date.now() + 30 * 86400000))
    };
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
    if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' });

    let users = readUsers();
    let emailLower = email.toLowerCase();
    let user = users[emailLower];
    
    // AUTO-REGISTRO: Se não existe, cria com 3 dias
    if (!user) {
        const threeDays = 3 * 86400000;
        user = {
            password: password,
            expiry: Date.now() + threeDays
        };
        users[emailLower] = user;
        writeUsers(users);
        return res.json({ success: true, message: 'Novo usuário! Você ganhou 3 dias de acesso grátis.' });
    }
    
    if (user.password === password) {
        if (Date.now() > user.expiry) {
            return res.status(403).json({ error: 'Acesso expirado' });
        }
        res.json({ success: true, message: 'Bem-vindo de volta!' });
    } else {
        res.status(401).json({ error: 'Senha inválida' });
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
