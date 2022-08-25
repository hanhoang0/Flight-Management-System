const pool = require('../../creds')
const begin = '\nBEGIN TRANSACTION'
const commit = 'COMMIT TRANSACTION\n'

async function append_queries(query){
  var fs = require('fs');
  fs.appendFile("query.sql", query , function (err) {
    if (err) throw err;  
  });
}

async function append_transactions(query){
  var fs = require('fs');
  fs.appendFile("transaction.sql", query , function (err) {
    if (err) throw err;  
  });
}

exports.view = async (req, res) => {
  try {
    //append
    q = `SELECT * FROM flight\n`
    await append_queries(q)
    //run query
    const result = await pool.query("SELECT * FROM flight")
    const flights = result.rows
    res.render('flight', { flights })
  } catch (err) {
    console.log(err.message)
  }
}

exports.find = async (req, res) => {
  try {
    const id = req.body.search
    //append
    q = `SELECT * FROM flight WHERE flight_id = ${id}\n`
    await append_queries(q)
    //run query
    const result = await pool.query("SELECT * FROM flight WHERE flight_id = $1",[id])
    const flights = result.rows
    res.render('flight', { flights })
  } catch (err) {
    console.log(err.message)
  }
}

//Create new flight
exports.form = (req, res) => res.render('add-flight')
exports.create = async (req, res) => {
  try {
    const {
      flight_id,
      departure_date,
      departure_time,
      arrival_date,
      arrival_time,
      departure_airport,
      arrival_airport
    } = req.body
    if (!req.body.flight_id ||!req.body.departure_date || !req.body.departure_time || !req.body.arrival_date ||
      !req.body.arrival_time || !req.body.departure_airport || !req.body.arrival_airport) {
      return res.render('add-flight', { alert: 'Missing Flight Information!' })
    }

    //append
    q = `INSERT INTO flight VALUES 
    (${flight_id},${departure_date},${departure_time},${arrival_date},${arrival_time},${departure_airport},${arrival_airport})`    
    await append_transactions(begin+'\n'+q+'\n'+commit)

    //transaction
    await pool.query(begin)
    await pool.query(
      "INSERT INTO flight VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [flight_id,
        departure_date,
        departure_time,
        arrival_date,
        arrival_time,
        departure_airport,
        arrival_airport])
    await pool.query(commit)
    res.render('add-flight', { alert: "Successfully add new flight!" })
  } catch (err) {
    res.render('add-flight', { alert: "Error: Flight ID existed or Invalid Input!" })
    console.log(err.message)
  }
}

//Open edit form
exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    //append
    q = `SELECT * FROM flight WHERE flight_id = ${id}\n`
    await append_queries(q)

    //run query
    const result = await pool.query(
      "SELECT * FROM flight WHERE flight_id = $1", [id])
    const flights = result.rows
    res.render('edit-flight', { flights })
  } catch (err) {
    console.log(err.message)
  }
}

//Edit flight
exports.update = async (req, res) => {
  try {
    const flight_id = req.params.id
    const {
      departure_date,
      departure_time,
      arrival_date,
      arrival_time,
      departure_airport,
      arrival_airport
    } = req.body

    //append
    q = `UPDATE flight SET departure_date = ${departure_date},
    departure_time = ${departure_time},
    arrival_date = ${arrival_date},
    arrival_time = ${arrival_time}, 
    departure_airport = ${departure_airport}, 
    arrival_airport = ${arrival_airport}
    WHERE flight_id = ${flight_id}`
    
    await append_transactions(begin+'\n'+q+'\n'+commit)

    //transaction
    await pool.query(begin)
    await pool.query(
      "UPDATE flight \
      SET departure_date = $1, \
      departure_time = $2, \
      arrival_date = $3, \
      arrival_time = $4, \
      departure_airport = $5, \
      arrival_airport = $6 \
      WHERE flight_id = $7",
      [departure_date,
        departure_time,
        arrival_date,
        arrival_time,
        departure_airport,
        arrival_airport,
        flight_id]
    )
    await pool.query(commit)
    
    //run query
    const result = await pool.query("SELECT * FROM flight WHERE flight_id = $1", [flight_id])
    const flights = result.rows
    res.render('edit-flight', { flights, alert: `Flight ${flight_id} successfully updated!` })
  } catch (err) {
    const result = await pool.query("SELECT * FROM flight WHERE flight_id = $1", [req.params.id])
    const flights = result.rows
    res.render('edit-flight', { flights, alert: "Error: Invalid Input!" })
    console.log(err.message)
  }
}

exports.remove = async (req, res) => {
  try {
    const flight_id = req.params.id

    //append
    q = `DELETE FROM flight WHERE flight_id = ${flight_id}`
    await append_transactions(begin+'\n'+q+'\n'+commit)

    //transaction
    await pool.query(begin)
    await pool.query("DELETE FROM flight WHERE flight_id = $1", [flight_id])
    await pool.query(commit)

    res.redirect('/flight')
  } catch (err) {
    console.log(err.message)
    const result = await pool.query("SELECT * FROM flight")
    const flights = result.rows
    res.render('flight', { flights, alert: "Unable to Delete!" })
  }
}
