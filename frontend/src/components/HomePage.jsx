import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BracketsManager } from 'brackets-manager';
import { InMemoryDatabase } from 'brackets-memory-db';

const storage = new InMemoryDatabase();
const manager = new BracketsManager(storage);

//clears all the data in the txt fields - important to place this post then function
//in the sumbit function or else the response wont have data and will trigger errors

const HomePage = () => {
    const [buttonClicked, setButtonClicked] = useState('');
    const [tournamentID, setTournamentID] = useState('');

    const [participants, setParticipants] = useState()
    const [tournamentDetails, setTournamentDetails] = useState()
    const [stageDetails, setStageDetails] = useState()

    const navigate = useNavigate();

    const handleChange = (e) => {
        let target = e.target;
        let value = target.value;
        let name = target.name;

        if (name === 'tournamentID') {
            setTournamentID(value);
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const userID = localStorage.getItem('userID');
        const userGamerTag = localStorage.getItem('userGamerTag');
        const intTournamentID = +tournamentID;

        //Join Tourney
        if (buttonClicked === 1){

            console.log(userID);
            console.log(userGamerTag);

            const formData = {
                tournamentID: intTournamentID,
                userID: userID,
                userGamerTag: userGamerTag,
            }

            axios({
                method: 'POST',
                url: 'http://localhost:4000/join_tournament',
                data: formData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } },
              })
                .then(async function (response) {
                  console.log('info sent');
                  if (response.data.message === true){
                    console.log("Build Tournament Catch")
                    const participantsData = response.data.participants
                    const tournamentData = response.data.tournamentDetails.rows[0]
                    setParticipants(participantsData)
                    setTournamentDetails(tournamentData)
                    
                    let tournamentState

                    try {
                        await manager.create.stage({
                            name: tournamentData.tournament_name,
                            tournamentId: 0, //could retrieve from db at initialization
                            type: "single_elimination",
                            seeding: participantsData,
                            settings: {
                                seedOrdering: ["natural"],
                                balanceByes: false,
                                size: tournamentData.player_total,
                                matchesChildCount: 0,
                                consolationFinal: false
                            }
                        })
                    } catch (error) {
                        console.error("error creating tourney")
                    }
                    
                    try{
                        console.log("saving tourney data")
                        tournamentState = await manager.get.stageData(0)
                        setStageDetails(tournamentState)
                    } catch (error) {
                        console.error("error making seed")
                    }

                    const participantTable = tournamentState.participant

                    const idNameMap = participantTable.reduce((map,participant) => {
                        map[participant.id] = participant.name;
                        return map;
                    },{})

                    const formData2 = {
                        t_id: tournamentData.id,
                        t_state: tournamentState,
                        p_idMap: idNameMap,
                    }


                    
                    axios({
                        method: 'POST',
                        url: 'http://localhost:4000/create_tournament_object',
                        data: formData2,
                        config: { headers: { 'Content-Type': 'multipart/form-data' } },
                      })
                      .then()
                      .catch()
                    
                      







                  }
                  console.log(response);
                  console.log(response.data);
                  
          
                  // Redirect to another route after successful submission
                  //navigate('/userHub'); // Use the navigate function - this belongs in the next axios post
                })
                .catch(function (response) {
                  // Handle errors
                });

            


                //axios post to send tourney state & info to DB (tourneyID, tourneyObject, idParticipantMap)
                //will need to create a new table in DB to store this

                //add viewer to the tournamentHub page, it will take in info from DB to populate it
            


        };

        //Create Tourney
        if (buttonClicked === 2){
            console.log('btn2');
            navigate('/createTournament')


        };

    };
  
    return (
            <div className="FormCenter">
                <div>
                    <p>Join or Create Tournament:</p>
                </div>

                <form onSubmit={handleSubmit} id="FormFields" className="FormFields" method="POST" action="/choice">
                    <div className='FormField'>
                        <label htmlFor='tournamentID'>Tournament ID: </label>
                        <input 
                            id='tournamentID' 
                            placeholder='ID' 
                            name='tournamentID' 
                            value={tournamentID} 
                            onChange={handleChange}/>
                    </div>

                    <div>
                        <button onClick={() => (setButtonClicked(1))} name='join'>Join Existing Tournament</button>
                    </div>

                    <p></p>

                    <div>
                        <button onClick={() => (setButtonClicked(2))} name='create'>Create Tournament</button>
                    </div>
               </form>
            </div>
            );




};





export {HomePage};