/*

This component will display all match couples and their respective round reported scores, the admin will have the ability to 
manually overide any score submitted, we will use some form of CSS to assist the admin in deciding if scores are submitted properly


I plan on first implementing a manual progression system for admins since this general system will remain useful beyond the implementation of auto-completed rounds

Reasons for manual progression: 
1) if a player does not respond or report, this will allow the admin to intervene and progress the tournament
2) if a player mistakenly or willingly reports an incorrect score which would directly affect the state of the tournament, allows the admin a layer of intervention 

---NEW---
I want to incorporate auto-updating to the scoring system, so that this component only has to handle non-balanced scores
-I will need to change the matchslip component to handle score checking on each submission, if the opponent score is non-null, then compare the two reported scores and update the tournament object with a winner using match.update function
-I will also need to likely create a new way to handle byes as well in order to incorporate auto scoring updates

I would also like to take in values from the user



*/