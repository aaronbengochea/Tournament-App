const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: 'XXXXXXXXXXXX',
  port: 5432,
})

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
  const {tournamentName, playerTotal, gameName, eliminationType, inviteOnly, inviteOnlyPasscode, startBy, endBy, completed, userID, userGamerTag } = req.body
  let tournamentID;


  pool.query('INSERT INTO tournaments \
              (tournament_name, player_total, game_name, elimination_type, \
              invite_only, invite_only_passcode, start_by, end_by, completed, created_by ) \
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
              [tournamentName, playerTotal, gameName, eliminationType, inviteOnly, inviteOnlyPasscode, startBy, endBy, completed, userID], (error, results) => {
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

    const entryCount = countResult.rows[0].entry_count;
    const playerTotal = playerTotalResults.rows[0].player_total;
    const hasJoined = checkEntryResults.rows[0].has_joined

    console.log(hasJoined)
    console.log(entryCount)
    console.log(playerTotal)


    if (hasJoined > 0) {
      res.status(400).json({message: 'You have already joined the tournament, please check the player hub'})
    }
    else if (entryCount < playerTotal){
      const insertUserQuery = 'INSERT INTO tm1 (tournament_id, gamertag, user_id) VALUES ($1, $2, $3)';
      await pool.query(insertUserQuery,[tournamentID, userGamerTag, userID])

      res.status(200).json({message: 'Congratulations! You have succesfully joined the tournament'})
    }
    else {
      res.status(400).json({message: 'Unfortunatly, the tournament is already at full capacity'})
    }

  } catch (error){
    res.status(500).json({message: 'Server Error'})
  }
}



module.exports = {
  createUser,
  createTournament,
  loginCheck,
  joinTournament,
}