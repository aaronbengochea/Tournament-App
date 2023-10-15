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
    const participants = ["1","Aaron","Cicy", "4", "5", "6", "7", "8"] //we can put gamertags here

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
            await manager.update.match({
              id: 3,
              opponent1: { score: 5 },
              opponent2: { score: 7, result: "win" }
            });

            await manager.update.match({
                id: 3,
                opponent1: { score: 7, result: "win"  },
                opponent2: { score: 5}
              });
            //const tourneyData2 = await manager.get.currentMatches(0);
            const tourneyData = await manager.get.stageData(0);
            
            setData(tourneyData);
            console.log("getLoser helper: ", helpers.getLoser(tourneyData.match[3]))
            
            console.log("balanceByes helper: ", helpers.balanceByes(participants2,size2))
            console.log("findPosition: ", helpers.findPosition(tourneyData.match,3))
            const newSeed = helpers.extractParticipantsFromSeeding(0,participants2)
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
        console.log(tournamentData.match.id)
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