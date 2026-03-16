const express = require('express');
const path = require('path');

const port = 8080;

const app = express();

app.use('/acesso', express.static(path.join(__dirname, 'ACESSO')));
app.use('/ofuscador', express.static(path.join(__dirname, 'OFUSCADOR')));

// Redirect root to ofuscador for convenience
app.get('/', (req, res) => {
    res.redirect('/ofuscador');
});

app.listen(port, () => {
    console.log(`🚀 [GL DEV] Servidor online!`);
    console.log(`➡️  ACESSO:    http://localhost:${port}/acesso`);
    console.log(`➡️  OFUSCADOR: http://localhost:${port}/ofuscador`);
});
