// Navigate from a tourney ID link in the UserHub & userID associated with the click
// This page will house the tournament info for the given tourney
    // such as: current entered player names, current bracket, elim type, game, etc
// at the bottom of this page, we will have a match slip relative to the user in that given tourney so that they can report
// this match slip only appears if there is an active match with that player at the moment


// This page will operate to serve that function above for every tournament that you joined. 


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {TournamentBracketsEditor} from './TournamentViewer'


function TournamentHub() {

  const [players, setPlayers] = useState([])
  const [tournamentInfo, setTournamentInfo] = useState([])
  const [createdByUserID, setCreatedByUserID] = useState(null)
  const [createdByGamertag, setCreatedByGamertag] = useState(null)
  

  useEffect(() => {
    const localStoreID = localStorage.getItem('userID');
    const localClickedTournamentID = localStorage.getItem('clickedTournamentID')

    axios.get('http://localhost:4000/tournament_loader', {
      params: {
        userID: localStoreID,
        clickedTournamentID: localClickedTournamentID
      }
    })
    .then(function (res) {
      console.log(res.data);
      setPlayers(res.data.players.rows);
      setTournamentInfo(res.data.tournamentInfo.rows[0]);
      setCreatedByUserID(res.data.tournamentInfo.rows[0].created_by)
    })
    .catch(function (err) {
      console.log(err);
    });
  }, []);

  useEffect(() => {
    if (createdByUserID && players.length > 0) {
      const createdByPlayer = players.find(player => player.user_id === createdByUserID)
      if (createdByPlayer){
        setCreatedByGamertag(createdByPlayer.gamertag)
        console.log(createdByPlayer.gamertag)
      }
    }
  }, [createdByUserID, players]);

  

  return (
    <div className="TournamentHub">
      <h2>Tournament Hub</h2>
      <h3>Tournament Details:</h3>
      <p>Tournament ID: {tournamentInfo.id}</p>
      <p>Name: {tournamentInfo.tournament_name}</p>
      <p>Game Type: {tournamentInfo.game_name}</p>
      <p>Elimination Type: {tournamentInfo.elimination_type}</p>
      <p>Admin: {createdByGamertag}</p>
      <p>Capacity: {players.length}/{tournamentInfo.player_total}</p>
      <p>Began? {tournamentInfo.began === 0 ? 'No' : 'Yes'}</p>
      <p>Completed? {tournamentInfo.completed === 0 ? 'No' : 'Yes'} </p>
      <p>Invite Only? {tournamentInfo.invite_only}</p>
      <p>Current Round: </p>
      <p></p>
      <h3>Participants:</h3>
      <ul>
        {players.map((player, index) => (
          <li key={index}>
            {player.gamertag}
          </li>
        ))}
      </ul>
      <div>
        <TournamentBracketsEditor></TournamentBracketsEditor>
      </div>
    </div>
  );
}

export { TournamentHub };


