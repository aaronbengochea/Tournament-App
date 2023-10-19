import React , {useState, useEffect}  from 'react';
import axios from 'axios';
import { BracketsManager } from 'brackets-manager';
import { InMemoryDatabase } from 'brackets-memory-db';



const  MatchSlip = (props) => {
    //if began = 1
    //take tourney object and feed it to bracket manager
    //use manager.get.currentRound --> will need tourney id (0) to fetch stage, will need stage.id to fetch matches
    const [data, setData] = useState()
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
                setData(data)
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

        console.log("match slip")
        console.log(data)
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
            
            
        </div>
    );
}

export {MatchSlip};