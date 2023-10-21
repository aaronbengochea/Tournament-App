import React , {useState, useEffect}  from 'react';
import axios from 'axios';
import { BracketsManager } from 'brackets-manager';
import { InMemoryDatabase } from 'brackets-memory-db';



const  MatchSlip = (props) => {
    //if began = 1
    //take tourney object and feed it to bracket manager
    //use manager.get.currentRound --> will need tourney id (0) to fetch stage, will need stage.id to fetch matches
    const [data, setData] = useState()
    const [playerScoreMap, setPlayerScoreMap] = useState()
    //const manager = new BracketsManager(data);

    
    //const currentStage = await manager.get.currentStage(tournamentID)
    //const currentRound = await manager.get.currentRound(currentStage.id)


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
                setData(data)
                setPlayerScoreMap(scoreMap)
            })
            .catch(err => {
                console.error("error occured")
            });
    }

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

            const participantArray = currentStage.participant
            

            const idNameMap = participantArray.reduce((map, participant) => {
                map[participant.id] = participant.name
                return map;
            },[])

            const localGamertag = localStorage.getItem('userGamerTag')
            let userObjectID = null
            let opponentObjectID = null
            let findUserMatch = null

            for (const id in idNameMap) {
                if (idNameMap[id] === localGamertag) {
                  userObjectID = +id;
                  break;
                }
            }

            if (userObjectID !== null) {
                for (const match of currentMatches) {
                  if (match.opponent1.id === userObjectID || match.opponent2.id === userObjectID){
                    if (match.opponent1.id === userObjectID){
                      opponentObjectID = match.opponent2.id;
                      findUserMatch = match;
                    } else {
                      opponentObjectID = match.opponent1.id;
                      findUserMatch = match;
                    }
                    break
                  }
                }
            }

            

            const playerScoreMapObjects = playerScoreMap.scores

            let playerScore = 0
            
            for (const row of playerScoreMapObjects) {
              console.log(row.name, localGamertag, row.name === localGamertag)
              if (row.name === localGamertag){
                console.log("setting playerScore")
                playerScore = row.score;
                break   
              }
              
            }

            

            console.log("match slip")


            console.log(data)
            //console.log(playerScoreMap.abeng)
            console.log(currentStage)
            console.log(currentRound)
            console.log(currentMatches)
            console.log(seeding)

            



        }
        //console.log(data)
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        printData();
        // eslint-disable-next-line
    }, [data]);


    //console.log(props.playerList)
    //console.log(props.tInfo)
    //console.log(currentRound[0])

    return (
        <div className="FormCenter">
            <p>Match Slip</p>
            <p>Current Round</p>
            <p>Opponent:</p>
            
        </div>
    );
}

export {MatchSlip};