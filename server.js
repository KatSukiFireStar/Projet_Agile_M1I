const express = require('express');
const path = require('path');
const app = express();
const port = 2023; // Numéro de port attribué

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(port, () => {
  console.log(`Le serveur tourne sur : http://localhost:${port}`);
});
