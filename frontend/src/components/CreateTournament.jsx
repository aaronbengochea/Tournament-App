import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//clears all the data in the txt fields - important to place this post then function
//in the sumbit function or else the response wont have data and will trigger errors
function ClearForm() {
    document.getElementById("tournamentName").value = '';
    document.getElementById("playerTotal").value = '';
    document.getElementById("gameName").value = '';
    document.getElementById("eliminationType").value = '';
    document.getElementById("startBy").value = '';
    document.getElementById("endBy").value = '';
    document.getElementById("inviteOnlyPasscode").value = '';
  }
  
  function CreateTournament() {
    const [formData, setFormData] = useState({
      tournamentName: '',
      playerTotal: '',
      gameName: '',
      eliminationType: '',
      inviteOnly: '',
      inviteOnlyPasscode: '',
      startBy: '',
      endBy: '',
    });

    const navigate = useNavigate();

    const handleInviteOnlyChange = (e) => {
        setFormData({...formData, inviteOnly: e.target.value});
    }

    const handleChange = (e) => {
        const {name , value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const userID = localStorage.getItem('userID');
        const userGamerTag = localStorage.getItem('userGamerTag');

        const updatedFormData = {
            ...formData,
            userID: userID,
            userGamerTag: userGamerTag,
        }
    
        axios({
          method: 'POST',
          url: 'http://localhost:4000/create_tournament',
          data: updatedFormData,
          config: { headers: { 'Content-Type': 'multipart/form-data' } },
        })
          .then(function (response) {
            console.log('info sent');
            console.log(updatedFormData);
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


      return (
        <div className="FormCenter">
            <div>
                <p>Create Tournament:</p>
            </div>

            <form onSubmit={handleSubmit} id="FormFields" className="FormFields" method="POST" action="/register">
                <div className='FormField'>
                    <label htmlFor='tournamentName'>Tournament Name: </label>
                    <input 
                        type='tournamentName' 
                        id='tournamentName' 
                        name='tournamentName' 
                        value={formData.tournamentName} 
                        onChange={handleChange}/>
                </div>

                <div className='FormField'>
                    <label htmlFor='playerTotal'>Player Total: </label>
                    <input 
                        type='playerTotal' 
                        id='playerTotal' 
                        name='playerTotal' 
                        value={formData.playerTotal} 
                        onChange={handleChange}/>
                </div>

                <div className='FormField'>
                    <label htmlFor='gameName'>Game Name: </label>
                    <input 
                        type='gameName' 
                        id='gameName' 
                        name='gameName' 
                        value={formData.gameName} 
                        onChange={handleChange}/>
                </div>

                <div className='FormField'>
                    <label htmlFor='eliminationType'>Elimination Type: </label>
                    <input 
                        type='eliminationType' 
                        id='eliminationType' 
                        name='eliminationType' 
                        value={formData.eliminationType} 
                        onChange={handleChange}/>
                </div>

                <div className='FormField'>
                    <label htmlFor='startBy'>Start By (EST): </label>
                    <input 
                        type='startBy' 
                        id='startBy' 
                        name='startBy' 
                        value={formData.startBy} 
                        onChange={handleChange}/>
                </div>

                <div className='FormField'>
                    <label htmlFor='endBy'>End By (EST): </label>
                    <input 
                        type='endBy' 
                        id='endBy' 
                        name='endBy' 
                        value={formData.endBy} 
                        onChange={handleChange}/>
                </div>

                <p></p>

                <div className='FormField'>
                    <label>Invite Only: </label>
                                           
                    <label>Yes</label>
                    <input  
                        type='radio'
                        name='inviteOnly'
                        value= 'Yes'
                        checked={formData.inviteOnly === 'Yes'}
                        onChange={handleInviteOnlyChange}/>

                    <label>No</label>
                    <input  
                        type='radio'
                        name='inviteOnly'
                        value= 'No'
                        checked={formData.inviteOnly === 'No'}
                        onChange={handleInviteOnlyChange}/>
                    
                    

                </div>

                <div className='FormField'>
                    <label htmlFor='inviteOnlyPasscode'>Invite Only Code: </label>
                    <input 
                        type='inviteOnlyPasscode' 
                        id='inviteOnlyPasscode' 
                        name='inviteOnlyPasscode' 
                        placeholder='4 digit code'
                        value={formData.inviteOnlyPasscode} 
                        onChange={handleChange}/>
                </div>


                

                <p></p>

                <div>
                    <button>Submit</button>
                </div>
            </form>
        </div>
    );
    };
    
    export {CreateTournament}; 






