import React, { useEffect, useState } from 'react';
import { InMemoryDatabase } from 'brackets-memory-db';
import { BracketsManager } from 'brackets-manager';

import "brackets-viewer/dist/brackets-viewer.min.css";
import "brackets-viewer/dist/brackets-viewer.min.js";
import "./tvs.css";


const storage = new InMemoryDatabase();
const manager = new BracketsManager(storage);

const { helpers } = require('brackets-manager');

const TournamentBracketsEditor = ({ type }) => {
    const [data, setData] = useState();

    const size = 8 //we can import this
    const participants = ["1","Aaron","Cicy", "chichi", "5", "6", "7", "8"] //we can put gamertags here

    const size2 = 16 //we can import this
    const participants2 = ["1", null, "Aaron", null, "Cicy", null, "4", null, "5",null, "6",null, "7",null, "8", "9"]

    const rerendering = async () => {
        const bracketsViewerNode = document.querySelector(".brackets-viewer");
        bracketsViewerNode?.replaceChildren();
        
        //Currently updating matches via click, we will need to use some form of getter to obtain match.id's corresponding to the user
        // window.bracketsViewer.onMatchClicked = async (match) => {
        
        window.bracketsViewer.onMatchClicked = async (match) => {
          console.log("A match was clicked", match);
    
          try {

            
            const tourneyData2 = await manager.get.stageData(0)
            const currentRound = await manager.get.currentRound(0)
            const participantArray = tourneyData2.participant
            const matchArray = tourneyData2.match
            const currentRoundMatchArray = matchArray.filter(match => match.round_id === currentRound.id)

            

            const idNameMap = participantArray.reduce((map, participant) => {
              map[participant.id] = participant.name
              return map;
            },[])

            const localGamertag = localStorage.getItem('userGamerTag')
            let userObjectID = null
            let opponentObjectID = null
            let findUserMatch = null

            for (const id in idNameMap) {
              if (idNameMap[id] === localGamertag) {
                userObjectID = +id;
                break;
              }
            }

            if (userObjectID !== null) {
              for (const match of currentRoundMatchArray) {
                if (match.opponent1.id === userObjectID || match.opponent2.id === userObjectID){
                  if (match.opponent1.id === userObjectID){
                    opponentObjectID = match.opponent2.id;
                    findUserMatch = match;
                  } else {
                    opponentObjectID = match.opponent1.id;
                    findUserMatch = match;
                  }
                  break
                }
              }
            }

            const playerScoreMap = {

              scores: participantArray.map(participant => ({
                  name: participant.name,
                  score: null
              }))
            }

            const playerScoreMapObjects = playerScoreMap.scores

            let playerScore = 0
            
            for (const row of playerScoreMapObjects) {
              console.log(row.name, localGamertag, row.name === localGamertag)
              if (row.name === localGamertag){
                console.log("setting playerScore")
                playerScore = row.score;      
              }
              
            }
            
            
            console.log(playerScoreMapObjects)
            console.log(currentRoundMatchArray)

            
            const roundCount = tourneyData2.round.length
            let roundName = null

            
            if (currentRound.id === tourneyData2.round[roundCount-1].id){
              roundName = "Final Round"
            } else if (currentRound.id === tourneyData2.round[roundCount-2].id) {
              roundName = "Semi Finals"
            } else if (currentRound.id === tourneyData2.round[roundCount-3].id) {
              roundName = "Quarter Finals"
            } else {
              roundName = "Round 1"
            }
            


            console.log(localGamertag)
            console.log("userTourneyID: ",  userObjectID)
            console.log("opponentTourneyID:", opponentObjectID)
            console.log("opponentName: ", idNameMap[opponentObjectID])
            console.log("Round Number: ", currentRound.id)
            console.log("currentRoundName: ", roundName)
            console.log("userCurrentMatch: ", findUserMatch)
            console.log("currentRound: ", currentRound)
            console.log("idNameMap: ", idNameMap)
            console.log("playerScoreMap: ", playerScoreMap)
            console.log("localUserReportedScore", playerScore)

            console.log("currentRoundMatchArray: ", currentRoundMatchArray)


            if (currentRound.id === 0) {
            await manager.update.match({
              id: match.id,
              opponent1: { score: 5, name: "Aaron", result: "win"},
              opponent2: { score: 7, name: "Bubba" }
            });
          }
            console.log("currentRound: ", currentRound)

            //const tourneyData2 = await manager.get.currentMatches(0);
            const tourneyData = await manager.get.stageData(0);

            console.log("postRender", tourneyData)

            setData(tourneyData);
            //console.log(helpers.findParticipant(tourneyData.participant,1))
            const seeding = await manager.get.seeding(0)

            console.log(seeding)
            
            console.log("getLoser helper: ", helpers.getLoser(tourneyData.match[3])) //gets loser of a certain match
            console.log("findPosition: ", helpers.findPosition(tourneyData.match,3)) //find who is in a certain position
            const newSeed = helpers.extractParticipantsFromSeeding(0,participants)           
            
            //use these to test larger bracket
            //console.log("balanceByes helper: ", helpers.balanceByes(participants2,size2)) //balance a list of players and nulls (byes)
            console.log("extractParticipantsFromSeed: ", newSeed )
            
            //console.log("A tourney", tourneyData2);
            //console.log("A Stage: ", tourneyData)
            // console.log(tourneyData);
          } catch (error) {}
        };

        
    
        if (data && data.participant !== null) {
          // This is optional. You must do it before render().
          window.bracketsViewer.setParticipantImages(
            data.participant.map((participant) => ({
              participantId: participant.id || 1,
              imageUrl: "https://github.githubassets.com/pinned-octocat.svg"
            }))
          );


            
          //renders the actual bracket
          window.bracketsViewer.render(
            {
              stages: data.stage,
              matches: data.match,
              matchGames: data.match_game,
              participants: data.participant
            },
            {
              customRoundName: (info, t) => {
                // You have a reference to `t` in order to translate things.
                // Returning `undefined` will fallback to the default round name in the current language.
                if (info.fractionOfFinal === 1 / 2) {
                  if (info.groupType === "single-bracket") {
                    // Single elimination
                    return "Semi Finals";
                  } else {
                    // Double elimination
                    return `${t(`abbreviations.${info.groupType}`)} ESemi Finals`;
                  }
                }
                if (info.fractionOfFinal === 1 / 4) {
                  return "Quarter Finals";
                }
    
                if (info.finalType === "grand-final") {
                  if (info.roundCount > 1) {
                    return `${t(`abbreviations.${info.finalType}`)} Final Round ${
                      info.roundNumber
                    }`;
                  }
                  return `Grand Final`;
                }
              },
              participantOriginPlacement: "before",
              separatedChildCountLabel: true,
              showSlotsOrigin: true,
              showLowerBracketSlotsOrigin: true,
              highlightParticipantOnHover: true
            }
          );
        }
        // console.log(data);
      };



    const rendering = async () => {
        await manager.create({
            name: "Tournament Name - Zero One",
            tournamentId: 0, //could retrieve from db at initialization
            type: "single_elimination",
            seeding: participants,
            settings: {
                seedOrdering: ["natural"],
                balanceByes: false,
                size: size,
                matchesChildCount: 0,
                consolationFinal: false
            }
        });


        const tournamentData = await manager.get.stageData(0);
        setData(tournamentData);
        console.log("first render: ", tournamentData);
        //tournamentData.participant[1].name = 'Sam'
        
    }

    useEffect(() => {
        rendering();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() => {
        rerendering();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data]);

    return (
        <div className="TournamentBracketsEditor">
          <div className="brackets-viewer"></div>
        </div>
      );
};

export {TournamentBracketsEditor};