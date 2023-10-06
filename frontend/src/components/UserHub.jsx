import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

function UserHub() {
  
  const [userTournaments, setUserTournaments] = useState({ joined: [], created: [] });


  useEffect(() => {
    const localStoreID = localStorage.getItem('userID');
    axios.get('http://localhost:4000/active_tournaments', {
      params: {
        userID: localStoreID
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

export { UserHub };