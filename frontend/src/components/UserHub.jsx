import React, {useEffect, useState} from 'react';
import axios from 'axios';


function UserHub() {
    const localStoreID = localStorage.getItem('userID')



    useEffect(() => {
        axios.get('http://localhost:4000/activeTournamentCheck', {
            params: {
                userID: localStoreID
            }
        })
        .then(function(res) {
            console.log(res)
        })
        .catch(function(err){
            console.log(err)
        });
    }, []);
       
    return (
            <div className="FormCenter">
                
                    <p>Registration Form: Aaron</p>
            
            </div>
        );
    };






export {UserHub};