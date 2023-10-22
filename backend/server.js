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
app.get('/active_tournaments',db.activeTournamentCheck)
app.get('/tournament_loader', db.tournamentHubLoader)
app.post('/create_tournament_object',db.createTournamentObject)
app.get('/get_tournament_object', db.getTournamentObject)
app.post('/update_reported_round_scores', db.updateReportedRoundScores)


app.get('/backend_check', (req,res) => {
  console.log('Backend Check Triggered')
  res.send('Backend Server Active')
});

app.listen(port, () => {
  console.log(`Server listning on port ${port}`)
});


