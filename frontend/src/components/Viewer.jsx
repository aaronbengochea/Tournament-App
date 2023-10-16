import React, { useEffect, useState } from 'react';
import axios from 'axios';

import "brackets-viewer/dist/brackets-viewer.min.css";
import "brackets-viewer/dist/brackets-viewer.min.js";
import "./tvs.css";

const { helpers } = require('brackets-manager');

const Viewer = ({ type }) => {
    const [data, setData] = useState();

    useEffect(() => {
        const localClickedTournamentID = localStorage.getItem('clickedTournamentID')
    
        axios.get('http://localhost:4000/get_tournament_object', {
          params: {
            clickedTournamentID: localClickedTournamentID
          }
        })
        .then(function (res) {
          console.log(res.data);
          setData(res.data.tournamentState);

        })
        .catch(function (err) {
          console.log(err);
        });
      }, []);




    const rendering = async () => {
        const bracketsViewerNode = document.querySelector(".brackets-viewer");
        bracketsViewerNode?.replaceChildren();
        
        //Currently updating matches via click, we will need to use some form of getter to obtain match.id's corresponding to the user
        // window.bracketsViewer.onMatchClicked = async (match) => {

        


    
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
    };





    useEffect(() => {
        rendering();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data]);

    return (
        <div className="TournamentBracketsEditor">
          <div className="brackets-viewer"></div>
        </div>
      );
};

export {Viewer};