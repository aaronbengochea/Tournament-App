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
     const [adminScoreOveride, setAdminScoreOveride] = useState([]);
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

             //sets temp arrays 
             let playerCount = currentMatches.length * 2;
             let adminScoreOverideTemp = Array(playerCount).fill(-1);
             let playerScoreOverideTemp = Array(playerCount).fill(-1);

             currentMatches.forEach((match, matchIndex) => {

                if(idNameMap[match.opponent1.id]){
                    const playerName = idNameMap[match.opponent1.id]
                    const playerScore = nameScoreMap[playerName]
                    match.opponent1.name = playerName
                    match.opponent1.repScore = playerScore
                    handlePlayerReportedArray(matchIndex, 0, playerScore, playerScoreOverideTemp)

                }

                if(idNameMap[match.opponent2.id]){
                    const playerName = idNameMap[match.opponent2.id]
                    const playerScore = nameScoreMap[playerName]
                    match.opponent2.name = playerName
                    match.opponent2.repScore = playerScore
                    handlePlayerReportedArray(matchIndex, 1, playerScore, playerScoreOverideTemp)

                }

             });
             setAdminScoreOveride(adminScoreOverideTemp)
             console.log(adminScoreOverideTemp)
             setScoreOveride(playerScoreOverideTemp)
             console.log(playerScoreOverideTemp)
             setMatches(currentMatches);
        };
     };

     const handleAdminOverideArray = (matchIndex, opponentIndex, value) => {
        let valueTemp = +value
        const inputIndex = matchIndex * 2 + opponentIndex;
        const updatedInputs = [...adminScoreOveride];
        updatedInputs[inputIndex] = valueTemp;
        setAdminScoreOveride(updatedInputs)
     }

     const handlePlayerReportedArray = (matchIndex, opponentIndex, value, playerScoreOverideTemp) => {
        const inputIndex = matchIndex * 2 + opponentIndex;
        playerScoreOverideTemp[inputIndex] = value;
     }
     
     
     const handleSubmit = async () => {
        const storage = new InMemoryDatabase();
        const manager = new BracketsManager(storage);
        await manager.import(data)

        let consolidatedAdminScores = [...adminScoreOveride]

        //weak spot... if the admin puts any number into the input, the field will no longer be -1, even if it was by mistake
        for(let i = 0; i < adminScoreOveride.length; i++){
            if(adminScoreOveride[i] === -1){
                consolidatedAdminScores[i] = scoreOveride[i]
            }
        }
        //now consolidated with report scores
        console.log(matches)

        //itr thru each match, update scores corresponding in consolidatedAdminScores
        matches.forEach(async (match, matchIndex) => {
            let modMatchIndex = matchIndex * 2;
            let oppOneScore = consolidatedAdminScores[modMatchIndex]
            let oppTwoScore = consolidatedAdminScores[modMatchIndex + 1]
       
            

            if(oppOneScore <= -1){
                oppOneScore = 0
            }

            if (oppTwoScore <= -1){
                oppTwoScore = 0
            }

            if(oppOneScore > oppTwoScore){
                await manager.update.match({
                    id: match.id,
                    opponent1: { score: 7, result: "win"},
                    opponent2: { score: 5}
                  });
            } else {
                await manager.update.match({
                    id: match.id,
                    opponent1: { score: 5},
                    opponent2: { score: 7, result: "win"}
                });
            }
        })

        const tournamentState = await manager.get.stageData(0)
        
        console.log(tournamentState)

        //I figured out the issue with the tourney object not updating
        //it has to do with the rendering of the bracket,
        //we will need to rebuild the bracket

        //rebuild playerScoreMap object with next rounds object
        //send playerScoreMap, playerIDMap, tourney state object, and tourneyID for storage in db

        //That completes one loop of a round.

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
                            value={adminScoreOveride[matchIndex * 2] === -1 ? '' : adminScoreOveride[matchIndex * 2]}
                            onChange={(e) => handleAdminOverideArray(matchIndex, 0, e.target.value)}
                        />
                    </div>
                    <div>
                        {match.opponent2.name} ----- Score Overide: 
                        <input
                            type="text"
                            value={adminScoreOveride[matchIndex * 2 + 1] === -1 ? '' : adminScoreOveride[matchIndex * 2 + 1]}
                            onChange={(e) => handleAdminOverideArray(matchIndex, 1, e.target.value)}
                        />
                    </div>
                    <hr />
                </div>
            ))}
            <button 
                type="submit"
                onClick={handleSubmit}>
                    Submit Scores
            </button>
        </div>
    );
            };
 
 export {AdminScoreOveride};