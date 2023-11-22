/*

This component will display all match couples and their respective round reported scores, the admin will have the ability to 
manually overide any score submitted, we will use some form of CSS to assist the admin in deciding if scores are submitted properly


I plan on first implementing a manual progression system for admins since this general system will remain useful beyond the implementation of auto-completed rounds

Reasons for manual progression: 
1) if a player does not respond or report, this will allow the admin to intervene and progress the tournament
2) if a player mistakenly or willingly reports an incorrect score which would directly affect the state of the tournament, allows the admin a layer of intervention 

---NEW---
I want to incorporate auto-updating to the scoring system, so that this component only has to handle non-balanced scores
-I will need to change the matchslip component to handle score checking on each submission, if the opponent score is non-null, then compare the two reported scores and update the tournament object with a winner using match.update function
-I will also need to likely create a new way to handle byes as well in order to incorporate auto scoring updates
*/
/* This will house the logic for the Admin force tourney creation

 -The button will only appear if the tourney is yet to begin
 -startParticipantCount will always be less then total participant count in these cases, we will need to fill a participants array with nulls 
 -We will need to use helper functions such as balanceByes to balance our nulls
 -We will create the json manager object
 -We will store the tournamentID, manager object, id|participant mapping, etc for later use
 -Tournament will render, button will fade
 -Update DB field began = 1

 */

 import React , {useState, useEffect}  from 'react';
 import axios from 'axios';
 import { BracketsManager } from 'brackets-manager';
 import { InMemoryDatabase } from 'brackets-memory-db';
 
 
 
 const  AdminScoreOveride = (props) => {

     const [data, setData] = useState()
     const [playerScoreMap, setPlayerScoreMap] = useState()
     const [tournamentID, setTournamentID] = useState()
     const [currentRound, setCurrentRound] = useState()


     const [scoreOveride, setScoreOveride] = useState([]);
     const [matches, setMatches] = useState([]);

 
 
     const fetchData = () => {
 
 
             const localClickedTournamentID = localStorage.getItem('clickedTournamentID')
             
             
             axios.get('http://localhost:4000/get_tournament_object', {
                 params: {
                     clickedTournamentID: localClickedTournamentID
                 }
             })
             .then(res => {
                 const data = res.data.tournamentState
                 const scoreMap = res.data.playerScoreMap
                 const tournamentID = res.data.currentTournamentID
                 setData(data)
                 setPlayerScoreMap(scoreMap)
                 setTournamentID(tournamentID)
             })
             .catch(err => {
                 console.error("error occured")
             });
     };
 
     const printData = async () => {
 
         
         if (data) {
 
             const storage = new InMemoryDatabase();
             const manager = new BracketsManager(storage);
             const tournamentID = 0
             
             await manager.import(data)
             const currentStage = await manager.get.stageData(tournamentID)
             const currentRound = await manager.get.currentRound(tournamentID)
             const currentMatches = await manager.get.currentMatches(tournamentID)
             const seeding = await manager.get.seeding(tournamentID)
             
            
             const idNameMap = currentStage.participant.reduce((nameMap, participant) => {
                nameMap[participant.id] = participant.name
                 return nameMap;
             },[])

             const nameScoreMap = playerScoreMap.scores.reduce((scoreMap, player) => {
                scoreMap[player.name] = player.score
                return scoreMap
             },[])

             currentMatches.forEach((match, matchIndex) => {

                if(idNameMap[match.opponent1.id]){
                    const playerName = idNameMap[match.opponent1.id]
                    const playerScore = nameScoreMap[playerName]
                    match.opponent1.name = playerName
                    match.opponent1.repScore = playerScore
                    handleInputChange(matchIndex, 0, playerScore)
                }

                if(idNameMap[match.opponent2.id]){
                    const playerName = idNameMap[match.opponent2.id]
                    const playerScore = nameScoreMap[playerName]
                    match.opponent2.name = playerName
                    match.opponent2.repScore = playerScore
                    handleInputChange(matchIndex, 1, playerScore)
                }

             });

             setMatches(currentMatches);
        };
     };
 
     const handleInputChange = (matchIndex, opponentIndex, value) => {
        const inputIndex = matchIndex * 2 + opponentIndex;
        const updatedInputs = [...scoreOveride];
        updatedInputs[inputIndex] = value;
        setScoreOveride(updatedInputs)
     }
 
     const handleSubmit = (e) => {

     };
 
     useEffect(() => {
         fetchData();
     }, []);
 
     useEffect(() => {
         printData();
         // eslint-disable-next-line
     }, [data]);


 
     return (
        <div className="FormCenter">
            {matches.map((match, matchIndex) => (
                <div key={matchIndex}>
                    <div>
                        {match.opponent1.name} ----- repScore: {match.opponent1.repScore}
                    </div>
                    <div>
                        {match.opponent2.name} ----- repScore: {match.opponent2.repScore}
                    </div>
                    {/* Additional fields for opponent names with input */}
                    <div>
                        {match.opponent1.name} ----- Score Overide: 
                        <input
                            type="text"
                            value={scoreOveride[matchIndex * 2] || ''}
                            onChange={(e) => handleInputChange(matchIndex, 0, e.target.value)}
                        />
                    </div>
                    <div>
                        {match.opponent2.name} ----- Score Overide: 
                        <input
                            type="text"
                            value={scoreOveride[matchIndex * 2 + 1] || ''}
                            onChange={(e) => handleInputChange(matchIndex, 1, e.target.value)}
                        />
                    </div>
                    <hr />
                </div>
            ))}
            <button type="submit">Submit Scores</button>
        </div>
    );
            };
 
 export {AdminScoreOveride};