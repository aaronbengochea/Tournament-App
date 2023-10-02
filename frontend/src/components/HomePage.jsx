import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//clears all the data in the txt fields - important to place this post then function
//in the sumbit function or else the response wont have data and will trigger errors
function ClearForm() {

    document.getElementById("tournamentID").value = '';
    
};


const HomePage = () => {
    const [buttonClicked, setButtonClicked] = useState('');
    const [tournamentID, setTournamentID] = useState('');

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

            console.log('btn1');
            console.log(typeof intTournamentID);
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
                .then(function (response) {
                  console.log('info sent');
                  console.log(response);
                  console.log(response.data);
          
                  // Redirect to another route after successful submission
                  navigate('/userHub'); // Use the navigate function
                })
                .catch(function (response) {
                  // Handle errors
                });




            ClearForm();

        };

        //Create Tourney
        if (buttonClicked === 2){
            console.log('btn2');
            navigate('/createTournament')
            ClearForm();

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