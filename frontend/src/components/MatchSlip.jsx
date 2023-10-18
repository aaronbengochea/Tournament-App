import React /* , {useState} */ from 'react';
//import axios from 'axios';


function MatchSlip(props) {
    //if began = 1
    //take tourney object and feed it to bracket manager
    //use manager.get.currentRound --> will need tourney id (0) to fetch stage, will need stage.id to fetch matches
    console.log("match slip")
    console.log(props.playerList)
    console.log(props.tInfo)

    return (
        <div className="FormCenter">
            <p>Match Slip</p>
            
            
        </div>
    );
}

export {MatchSlip};