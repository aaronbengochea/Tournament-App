import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//clears all the data in the txt fields - important to place this post then function
//in the sumbit function or else the response wont have data and will trigger errors
function ClearForm() {

    document.getElementById("gamerTag").value = '';
    document.getElementById("email").value = '';
    document.getElementById("password").value = '';
};

function SignUp() {
    const [gamerTag, setGamerTag] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Get the navigate function

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'gamerTag') {
            setGamerTag(value);
        } else if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            gamerTag,
            email,
            password,
        }

        axios({
            method: 'POST',
            url: 'http://localhost:4000/create_user',
            data: formData,
            config: {headers: {'Content-Type' : 'multipart/form-data'}}
        })

        .then(function (response) {
            console.log('info sent')
            console.log(response)
            console.log(response.data)

            const userID = response.data.userID
            const userGamerTag = response.data.userGamerTag

            localStorage.setItem('userID', userID)
            const localStoreID = localStorage.getItem('userID');
            console.log('Locally Stored UserID:', localStoreID);

            localStorage.setItem('userGamerTag', userGamerTag)
            const localStoreGamerTag = localStorage.getItem('userGamerTag');
            console.log('Locally Stored UserID:', localStoreGamerTag);

            navigate('/home')
            ClearForm();

        })
        .catch(function(response) {

        })
    }

    
    return (
            <div className="FormCenter">
                <div>
                    <p>Registration Form:</p>
                </div>

                <form onSubmit={handleSubmit} id="FormFields" className="FormFields" method="POST" action="/register">
                    <div className='FormField'>
                        <label htmlFor='gamerTag'>Gamertag: </label>
                        <input type='gamerTag' id='gamerTag' placeholder='Enter gamertag' name='gamerTag' value={gamerTag} onChange={handleChange}/>
                    </div>

                    <div className='FormField'>
                        <label htmlFor='email'>E-mail: </label>
                        <input type='email' id='email' placeholder='Enter email' name='email' value={email} onChange={handleChange}/>
                    </div>

                    <div className='FormField'>
                        <label htmlFor='password'>Password: </label>
                        <input type='password' id='password' placeholder='Enter password' name='password' value={password} onChange={handleChange}/>
                    </div>

                    <p></p>

                    <div>
                        <button>Register</button>
                    </div>
                </form>
            </div>
        );
    };






export {SignUp};