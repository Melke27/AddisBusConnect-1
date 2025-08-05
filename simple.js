const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Server working!'));
app.listen(8080, '127.0.0.1', () => console.log('Server running at http://127.0.0.1:8080'));
