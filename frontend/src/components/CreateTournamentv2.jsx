import React from 'react';
import axios from 'axios';

class CreateTournamentv2 extends React.Component{
    constructor() {
        super();

        this.state = {
            tournamentName: '',
            playerTotal: '',
            gameName: '',
            eliminationType: '',
            inviteOnly: '',
            inviteOnlyPasscode: '',
            startBy: '',
            endBy: '',
            completed: 'No',

        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInviteOnlyChange = (e) => {
        this.setState({inviteOnly: e.target.value})
    }

    handleChange(e) {
        // console.log(e);
        let target = e.target;
        let value = target.value; 
        let name = target.name;

        this.setState({[name]: value});
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = {
            tournamentName: this.state.tournamentName,
            playerTotal: this.state.playerTotal,
            gameName: this.state.gameName,
            eliminationType: this.state.eliminationType,
            inviteOnly: this.state.inviteOnly,
            inviteOnlyPasscode: this.state.inviteOnlyPasscode,
            startBy: this.state.startBy,
            endBy: this.state.endBy,
            completed: this.state.completed,
        }

        axios({
            method: 'POST',
            url: 'http://localhost:4000/create_tournament',
            data: formData,
            config: {headers: {'Content-Type' : 'multipart/form-data'}}
        })

        .then(function (response) {
            console.log('info sent')
            console.log(formData)
            console.log(response)
            console.log(response.data)

        })
        .catch(function(response) {

        })
        
        //ClearForm();
    }

    render(){
    return (
            <div className="FormCenter">
                <div>
                    <p>Create Tournament:</p>
                </div>

                <form onSubmit={this.handleSubmit} id="FormFields" className="FormFields" method="POST" action="/register">
                    <div className='FormField'>
                        <label htmlFor='tournamentName'>Tournament Name: </label>
                        <input 
                            type='tournamentName' 
                            id='tournamentName' 
                            name='tournamentName' 
                            value={this.state.tournamentName} 
                            onChange={this.handleChange}/>
                    </div>

                    <div className='FormField'>
                        <label htmlFor='playerTotal'>Player Total: </label>
                        <input 
                            type='playerTotal' 
                            id='playerTotal' 
                            name='playerTotal' 
                            value={this.state.playerTotal} 
                            onChange={this.handleChange}/>
                    </div>

                    <div className='FormField'>
                        <label htmlFor='gameName'>Game Name: </label>
                        <input 
                            type='gameName' 
                            id='gameName' 
                            name='gameName' 
                            value={this.state.gameName} 
                            onChange={this.handleChange}/>
                    </div>

                    <div className='FormField'>
                        <label htmlFor='eliminationType'>Elimination Type: </label>
                        <input 
                            type='eliminationType' 
                            id='eliminationType' 
                            name='eliminationType' 
                            value={this.state.eliminationType} 
                            onChange={this.handleChange}/>
                    </div>

                    <div className='FormField'>
                        <label htmlFor='startBy'>Start By (EST): </label>
                        <input 
                            type='startBy' 
                            id='startBy' 
                            name='startBy' 
                            value={this.state.startBy} 
                            onChange={this.handleChange}/>
                    </div>

                    <div className='FormField'>
                        <label htmlFor='endBy'>End By (EST): </label>
                        <input 
                            type='endBy' 
                            id='endBy' 
                            name='endBy' 
                            value={this.state.endBy} 
                            onChange={this.handleChange}/>
                    </div>

                    <p></p>

                    <div className='FormField'>
                        <label>Invite Only: </label>
                                               
                        <label>Yes</label>
                        <input  
                            type='radio'
                            name='inviteOnly'
                            value= 'Yes'
                            checked={this.state.inviteOnly === 'Yes'}
                            onChange={this.handleInviteOnlyChange}/>

                        <label>No</label>
                        <input  
                            type='radio'
                            name='inviteOnly'
                            value= 'No'
                            checked={this.state.inviteOnly === 'No'}
                            onChange={this.handleInviteOnlyChange}/>
                        
                        

                    </div>

                    <div className='FormField'>
                        <label htmlFor='inviteOnlyPasscode'>Invite Only Code: </label>
                        <input 
                            type='inviteOnlyPasscode' 
                            id='inviteOnlyPasscode' 
                            name='inviteOnlyPasscode' 
                            placeholder='4 digit code'
                            value={this.state.inviteOnlyPasscode} 
                            onChange={this.handleChange}/>
                    </div>


                    

                    <p></p>

                    <div>
                        <button>Submit</button>
                    </div>
                </form>
            </div>
        );
    };
};





export {CreateTournamentv2};