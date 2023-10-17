import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Viewer } from './Viewer';
//import { useNavigate } from 'react-router-dom';
import { BracketsManager } from 'brackets-manager';
import { InMemoryDatabase } from 'brackets-memory-db';
const { helpers } = require('brackets-manager');

const storage = new InMemoryDatabase();
const manager = new BracketsManager(storage);

function TournamentHub() {

  const [players, setPlayers] = useState([])
  const [tournamentInfo, setTournamentInfo] = useState([])
  const [createdByUserID, setCreatedByUserID] = useState(null)
  const [createdByGamertag, setCreatedByGamertag] = useState(null)
  const [localStoreID, setLocalStoreID] = useState()
  const [showAdminButton, setShowAdminButton] = useState(false)
  //const navigate = useNavigate();
  
  const handleAdminForceStart = async () => {

    const playerCount = players.length
    const roundedPlayerCount = helpers.getNearestPowerOfTwo(playerCount)
    console.log(players)

    const filledPlayerArray = []

    for (let i = 0; i < playerCount; i++){
      filledPlayerArray.push(players[i].gamertag)
    }

    while (filledPlayerArray.length < roundedPlayerCount - 1) {
      filledPlayerArray.push(null)
    }

    const updatedPlayerArray = helpers.balanceByes(filledPlayerArray, roundedPlayerCount)

    try {
      await manager.create.stage({
          name: tournamentInfo.tournament_name,
          tournamentId: 0, //could retrieve from db at initialization
          type: "single_elimination",
          seeding: updatedPlayerArray,
          settings: {
              seedOrdering: ["natural"],
              balanceByes: false,
              size: roundedPlayerCount,
              matchesChildCount: 0,
              consolationFinal: false
          }
      })
    } catch (error) {
      console.error("error creating tourney")
    }

    const tournamentState = await manager.get.stageData(0)
    console.log(tournamentState)


    const participantTable = tournamentState.participant

    const idNameMap = participantTable.reduce((map,participant) => {
      map[participant.id] = participant.name;
      return map;
    },{})

    console.log(idNameMap)

    
    const formData2 = {
      t_id: tournamentInfo.id,
      t_state: tournamentState,
      p_idMap: idNameMap,
    }

    axios({
      method: 'POST',
      url: 'http://localhost:4000/create_tournament_object',
      data: formData2,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
    .then(function (response) {
        console.log("Backend t_state Store: ", response)
        window.location.reload();
    })
    .catch()
    
}

  useEffect(() => {
    const localStoreID = localStorage.getItem('userID');
    const localClickedTournamentID = localStorage.getItem('clickedTournamentID')
    setLocalStoreID(localStoreID)


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

        if (createdByUserID === localStoreID && tournamentInfo.began === 0) {
          setShowAdminButton(true)
        }
      }
    }
  }, [createdByUserID, players, localStoreID, tournamentInfo]);

  //build in check so that it only attempts to use Viewer when the began is set to yes

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
      {showAdminButton && (
        <button onClick={handleAdminForceStart}>
          Admin Button
        </button>
      )}
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
        
        {tournamentInfo.began === 1 && <Viewer/>}
      </div>
    </div>
  );
}

export { TournamentHub };


