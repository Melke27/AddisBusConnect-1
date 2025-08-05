const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send('AddisBusConnect Server is running!');
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
  console.log(`Server running at http://localhost:${port}`);
}); 