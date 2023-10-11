// Navigate from a tourney ID link in the UserHub & userID associated with the click
// This page will house the tournament info for the given tourney
    // such as: current entered player names, current bracket, elim type, game, etc
// at the bottom of this page, we will have a match slip relative to the user in that given tourney so that they can report
// this match slip only appears if there is an active match with that player at the moment


// This page will operate to serve that function above for every tournament that you joined. 

/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

function ClickedTournamentPage() {

  useEffect(() => {
    const localStoreID = localStorage.getItem('userID');
    const localClickedTournamentID = localStorage.getItem('clickedTournamentID')

    axios.get('http://localhost:4000/active_tournaments', {
      params: {
        userID: localStoreID,
        clickedTournamentID = localClickedTournamentID
      }
    })
    .then(function (res) {
      setUserTournaments(res.data);
    })
    .catch(function (err) {
      console.log(err);
    });
  }, []);

  const handleTournamentIDClick = (tournamentID) => {
      localStorage.setItem('clickedTournamentID', tournamentID);
  };

  return (
    <div className="UserHub">
      <h2>Your Tournaments</h2>
      <div className="TournamentList">
        <h3>Joined Tournaments:</h3>
        <table>
          <thead>
            <tr>
              <th className="table-cell">ID</th>
              <th className="table-cell">Tournament Name</th>
              <th className="table-cell">Player Total</th>
            </tr>
          </thead>
          <tbody>
            {userTournaments.joined.map((tournament, index) => (
              <tr key={index}>
                <td className="table-cell">   
                    <NavLink
                        to="/tournamentPage"
                        onClick={() => handleTournamentIDClick(tournament.id)}
                    >
                        {tournament.id}
                    </NavLink>
                </td>
                <td className="table-cell">{tournament.tournament_name}</td>
                <td className="table-cell">{tournament.player_total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Created Tournaments:</h3>
        <table>
          <thead>
            <tr>
              <th className="table-cell">ID</th>
              <th className="table-cell">Tournament Name</th>
              <th className="table-cell">Player Total</th>
            </tr>
          </thead>
          <tbody>
            {userTournaments.created.map((tournament, index) => (
              <tr key={index}>
                <td className="table-cell">{tournament.id}</td>
                <td className="table-cell">{tournament.tournament_name}</td>
                <td className="table-cell">{tournament.player_total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { ClickedTournamentPage };


*/