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
    const [currentRound, setCurrentRound] = useState()
    const [currentOpponentName, setCurrentOpponentName] = useState()
    const [currentOpponentID, setCurrentOpponentID] = useState()
    const [userTournamentID, setUserTournamentID] = useState()
    const [showRoundScoreSubmitButton, setShowRoundScoreSubmitButton] = useState(false)
    const [userReportedScore, setUserReportedScore] = useState('')
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

            setCurrentRound(currentRound.number)
            

            const idNameMap = participantArray.reduce((map, participant) => {
                map[participant.id] = participant.name
                return map;
            },[])

            const localGamertag = localStorage.getItem('userGamerTag')
            let userObjectID = null
            let opponentObjectID = null
            let opponentObjectName = null
            let findUserMatch = null

            for (const id in idNameMap) {
                if (idNameMap[id] === localGamertag) {
                  userObjectID = +id;
                  setUserTournamentID(userObjectID)
                  break;
                }
            }

            
            if (userObjectID !== null) {
                for (const match of currentMatches) {
                  if (match.opponent1.id === userObjectID || match.opponent2.id === userObjectID){
                    if (match.opponent1.id === userObjectID){
                      opponentObjectID = match.opponent2.id;
                      setCurrentOpponentID(opponentObjectID)
                      findUserMatch = match;
                    } else {
                      opponentObjectID = match.opponent1.id;
                      setCurrentOpponentID(opponentObjectID)
                      findUserMatch = match;
                    }
                    break
                  }
                }
            }

            for (const id in idNameMap) {
                if (id === String(opponentObjectID)){
                    opponentObjectName = idNameMap[id]
                    setCurrentOpponentName(opponentObjectName)
                }
            }

            //finding user score, if null then take response (reveal field box) else display score and dont give option to submit again
            const playerScoreMapObjects = playerScoreMap.scores

            let playerScore = 0
            
            for (const row of playerScoreMapObjects) {
              if (row.name === localGamertag){
                console.log("setting playerScore")
                playerScore = row.score;
                break   
              }
              
            }



            //Gets round count name for display
            const roundCount = currentStage.round.length
            let roundName = null

            
            if (currentRound.id === currentStage.round[roundCount-1].id){
              roundName = "Final Round"
            } else if (currentRound.id === currentStage.round[roundCount-2].id) {
                roundName = "Semi Finals"
            } else if (currentRound.id === currentStage.round[roundCount-3].id) {
                roundName = "Quarter Finals"
            } else {
                const roundToString = String(currentRound.id)
                roundName = "Round " + roundToString
            }

            setCurrentRound(roundName)

            if (playerScore === null){
                setShowRoundScoreSubmitButton(true)
            }


            console.log("match slip")
            console.log(data)
            //console.log(playerScoreMap.abeng)
            console.log(currentStage)
            console.log(currentRound)
            console.log(currentMatches)
            console.log(seeding)
            console.log(userObjectID)
            console.log(opponentObjectName)
            console.log(opponentObjectID)
            console.log(findUserMatch)
            console.log(playerScore)
            console.log(roundName)
            console.log(playerScoreMap)

            



        }
        //console.log(data)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'reportedScore') {
            setUserReportedScore(value);
        }   
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const localGamertag = localStorage.getItem('userGamerTag')

        let p_scoreMap = playerScoreMap
        console.log(playerScoreMap)

        for (const row of p_scoreMap.scores) {
            if (row.name === localGamertag){
              row.score = userReportedScore;
              console.log(row.name, row.score)
              break   
            }
        }

        setPlayerScoreMap(p_scoreMap)
        setShowRoundScoreSubmitButton(false)
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
            <p>Current Round: {currentRound}</p>
            <p>Opponent: {currentOpponentName}</p>
            {showRoundScoreSubmitButton && (
            <div>
                <form  onSubmit={handleSubmit} id="FormFields" className="FormFields">
                    <div className='FormField'>
                        <label> Report Score: </label>
                        <input name='reportedScore' value={userReportedScore} onChange={handleChange}/>
                    </div>

                    <p></p>

                    <div>
                        <button>Submit Round Score</button>
                    </div>
                </form>
            </div>
            
            )}
            
        </div>
    );
}

export {MatchSlip};