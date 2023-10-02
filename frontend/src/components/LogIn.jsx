import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//clears all the data in the txt fields - important to place this post then function
//in the sumbit function or else the response wont have data and will trigger errors
function ClearForm() {
    document.getElementById("email").value = '';
    document.getElementById("password").value = '';
};

function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Get the navigate function

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            email,
            password,
        }

        axios({
            method: 'POST',
            url: 'http://localhost:4000/login_check',
            data: formData,
            config: {headers: {'Content-Type' : 'multipart/form-data'}}
        })

        .then(function (response) {
            console.log('info sent')

            const userExists = response.data.userExists;
            

            if (userExists === true){
                const userID = response.data.userID;
                const userGamerTag = response.data.userGamerTag;
                console.log(response)
                console.log(response.data)

                localStorage.setItem('userID', userID);
                const localStoreID = localStorage.getItem('userID');
                console.log('Locally Stored UserID:', localStoreID);

                localStorage.setItem('userGamerTag', userGamerTag);
                const localStoreGamerTag = localStorage.getItem('userGamerTag');
                console.log('Locally Stored GamerTag:', localStoreGamerTag)

                navigate('/home')
                ClearForm();
            }
            else {
                console.log('Error: email and password dont match')
            }
            
            

        })
        .catch(function(response) {

        })
        
        
    }

    
    return (
            <div className="FormCenter">
                <div>
                    <p>Log In Form:</p>
                </div>

                <form onSubmit={handleSubmit} id="FormFields" className="FormFields" method="POST" action="/register">
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
                        <button>Sign In</button>
                    </div>
                </form>
            </div>
        );
    };






export {LogIn};