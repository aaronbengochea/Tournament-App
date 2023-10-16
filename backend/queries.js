const pool = require('./dbConfig')

const createUser = (req,res) => {
  const {gamerTag, email, password} = req.body

  pool.query(
    'INSERT INTO users (gamertag, email, password) VALUES ($1, $2, $3) RETURNING *',
    [gamerTag, email, password],
    (error, results) => {
      if (error) {
        throw error
      }
      const userID = results.rows[0].id;
      const userGamerTag = results.rows[0].gamertag

      res.status(201).json({userID, userGamerTag});
  })
};

const createTournament = (req,res) => {
  const {tournamentName, playerTotal, gameName, eliminationType, inviteOnly, inviteOnlyPasscode, startBy, endBy, userID, userGamerTag } = req.body
  let tournamentID;


  pool.query('INSERT INTO tournaments \
              (tournament_name, player_total, game_name, elimination_type, \
              invite_only, invite_only_passcode, start_by, end_by, created_by ) \
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
              [tournamentName, playerTotal, gameName, eliminationType, inviteOnly, inviteOnlyPasscode, startBy, endBy, userID], (error, results) => {
    if (error) {
      throw error
    }

    tournamentID = results.rows[0].id;

    pool.query(
      'INSERT INTO tm1 (tournament_id, gamertag, user_id) VALUES ($1, $2, $3) RETURNING *',
      [tournamentID, userGamerTag, userID ], (secondError, secondResult) => {
        if (secondError) {
          throw secondError
        }

        res.status(201).send(`Tourney ID: ${tournamentID}, Created By User: ${userGamerTag}, User ID: ${userID}`);
      }
    )




    //res.status(201).send(`Tournament Created with ID: ${results.rows[0].id}`)
  })
};

const loginCheck = (req, res) => {
  const {email, password} = req.body;

  pool.query(
    'SELECT * FROM users WHERE email = $1 AND password = $2',
    [email, password],
    (error, results) => {
      if (error) {
        throw error;
      }

      if (results.rows.length === 1) {
        const userID = results.rows[0].id;
        const userGamerTag = results.rows[0].gamertag;
        res.status(200).json({userExists: true, userID, userGamerTag});
      }
      else {
        res.status(200).json({userExists: false, userID: null, userGamerTag: null});
      }
    }
  );
};

async function joinTournament(req,res){
  try {
    const {tournamentID, userGamerTag, userID} = req.body;

    const checkEntryQuery = 'SELECT COUNT(*) AS has_joined FROM tm1 WHERE tournament_id = $1 AND user_id = $2';
    const checkEntryResults = await pool.query(checkEntryQuery,[tournamentID, userID])

    const countQuery = 'SELECT COUNT(*) AS entry_count FROM tm1 WHERE tournament_id = $1';
    const countResult = await pool.query(countQuery,[tournamentID])

    const playerTotalQuery = 'SELECT player_total FROM tournaments WHERE id = $1';
    const playerTotalResults = await pool.query(playerTotalQuery,[tournamentID]);

    const entryCount = parseInt(countResult.rows[0].entry_count);
    const playerTotal = playerTotalResults.rows[0].player_total;
    const hasJoined = parseInt(checkEntryResults.rows[0].has_joined);

    console.log("hasJoined?", hasJoined)
    console.log("entryCount: ", entryCount)

    if (hasJoined > 0) {
      res.status(200).json({message: 'You have already joined the tournament, please check the player hub'})
    }
    else if (entryCount < playerTotal){
      const insertUserQuery = 'INSERT INTO tm1 (tournament_id, gamertag, user_id) VALUES ($1, $2, $3)';
      await pool.query(insertUserQuery,[tournamentID, userGamerTag, userID])

      const selectTournamentQuery = 'SELECT * FROM tournaments WHERE id = $1';
      const selectTournamentResults = await pool.query(selectTournamentQuery,[tournamentID])

      const selectParticipantsQuery = 'SELECT * FROM tm1 WHERE tournament_id = $1';
      const selectParticipantsResults = await pool.query(selectParticipantsQuery, [tournamentID])

      console.log("Began? ", selectTournamentResults.rows[0].began === 0)
      console.log("entryCount: ", entryCount)
      console.log("playerTotal-1: ", playerTotal - 1)

      if (selectTournamentResults.rows[0].began === 0 && entryCount === playerTotal - 1){

        const participants = []

        selectParticipantsResults.rows.forEach(row => {
          participants.push(row.gamertag)
        })

        res.status(200).json({message: true, participants: participants, tournamentDetails: selectTournamentResults})

      }else{
        res.status(200).json({message: 'Congratulations! You have succesfully joined the tournament'})
      }

    }
    else {
      res.status(400).json({message: 'Unfortunatly, the tournament is already at full capacity'})
    }

  } catch (error){
    res.status(500).json({message: 'Server Error'})
  }
}

async function activeTournamentCheck(req,res){
  try {
    const userID = req.query.userID

    const activeTourneyQuery = 'SELECT * FROM tm1 WHERE user_id = $1'
    const activeTourneyResult = await pool.query(activeTourneyQuery,[userID])

    const activeTournamentIDs = activeTourneyResult.rows.map(row => row.tournament_id)

    const activeTourneyInfoQuery = 'SELECT * FROM tournaments WHERE id = ANY($1::int[])'
    const activeTourneyInfoResults = await pool.query(activeTourneyInfoQuery,[activeTournamentIDs])

    const has_joined = []
    const has_created = []

    activeTourneyInfoResults.rows.forEach(row => {
      if (row.created_by === userID) {
        has_created.push(row);
      }
      else {
        has_joined.push(row);
      }
    })

    res.status(200).json({ joined: has_joined, created: has_created});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
}


async function tournamentHubLoader(req,res){
  try {
    const userID = req.query.userID
    const clickedTournamentID = req.query.clickedTournamentID

    const playerQuery = 'SELECT * FROM tm1 WHERE tournament_id = $1'
    const playerResult = await pool.query(playerQuery, [clickedTournamentID])

    const tournamentQuery = 'SELECT * FROM tournaments WHERE id = $1'
    const tournamentResult = await pool.query(tournamentQuery,[clickedTournamentID])

    res.status(200).json({players: playerResult, tournamentInfo: tournamentResult});
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Server Error'})
    }
}

const createTournamentObject = (req,res) => {
  const {t_id, t_state, p_idMap} = req.body

  pool.query(
    'INSERT INTO t_state (tournament_id, tournament_state, player_id_map) VALUES ($1, $2, $3) RETURNING *',
    [t_id, t_state, p_idMap],
    (error, results) => {
      if (error) {
        throw error
      }
      const tournamentID = results.rows[0].tournament_id;
      const tournamentState = results.rows[0].tournament_state;
      const playerIDMap = results.rows[0].player_id_map;

      pool.query(
        'UPDATE tournaments SET began = 1 WHERE id = $1',
        [t_id],
        (updateError, updateResult) => {
          if (updateError) {
            console.error("Error updating the began field")
            res.status(500).json({error: "Internal Service Error"})
          } else {
            res.status(201).json({tournamentID, tournamentState, playerIDMap});
          }
        }
      ) 
  })
};

async function getTournamentObject(req,res){
  try {
    const tournamentID = req.query.clickedTournamentID

    const retriveStateQuery = 'SELECT * FROM t_state WHERE tournament_id = $1'
    const retrieveStateResult = await pool.query(retriveStateQuery,[tournamentID])

    const tournamentState = retrieveStateResult.rows[0].tournament_state


    res.status(200).json({tournamentState});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
}




module.exports = {
  createUser,
  createTournament,
  loginCheck,
  joinTournament,
  activeTournamentCheck,
  tournamentHubLoader,
  createTournamentObject,
  getTournamentObject,


}