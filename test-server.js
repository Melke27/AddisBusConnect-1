const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World! Server is working!');
});

app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
}); 