const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./queries');
const port = 4000;

app.use(express.json());
app.use(cors());


app.post('/create_user', db.createUser)
app.post('/create_tournament', db.createTournament)
app.post('/login_check', db.loginCheck)
app.post('/join_tournament', db.joinTournament)


app.get('/backend_check', (req,res) => {
  console.log('Backend Check Triggered')
  res.send('Backend Server Active')
});

app.listen(port, () => {
  console.log(`Server listning on port ${port}`)
});


{/*
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World I am backk');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

*/}