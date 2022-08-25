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
    q = `SELECT * FROM boarding\n`
    await append_queries(q)
    //run query
    const result = await pool.query("SELECT * FROM boarding")
    const boarding = result.rows
    res.render('boarding', { boarding })
  } catch (err) {
    console.log(err.message)
  }
}

exports.find = async (req, res) => {
  try {
    const id = req.body.search
    //append
    q = `SELECT * FROM boarding WHERE boarding_id = ${id}\n`
    await append_queries(q)

    //run query
    const result = await pool.query(
      "SELECT * FROM boarding WHERE boarding_id = $1", [id])
    const boarding = result.rows
    res.render('boarding', { boarding })
  } catch (err) {
    console.log(err.message)
  }
}

//Create new boarding info
exports.form = (req, res) => res.render('add-boarding')
exports.create = async (req, res) => {
  try {
    const {
      boarding_id,
      flight_id,
      ticket_no,
      boarding_time,
      gate,
      seat_no,
      baggage_id
    } = req.body
    if (!req.body.boarding_id || !req.body.flight_id || !req.body.ticket_no ||
      !req.body.boarding_time || !req.body.gate || !req.body.seat_no || !req.body.baggage_id) {
      return res.render('add-boarding', { alert: 'Missing Boarding Information!' })
    }

    //append
    q = `INSERT INTO boarding VALUES 
    (${boarding_id},${flight_id},${ticket_no},${boarding_time},${gate},${seat_no},${baggage_id})`    
    await append_transactions(begin+'\n'+q+'\n'+commit)

    //transaction
    await pool.query(begin)
    await pool.query(
      "INSERT INTO boarding VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [boarding_id,
        flight_id,
        ticket_no,
        boarding_time,
        gate,
        seat_no,
        baggage_id])
    await pool.query(commit)

    res.render('add-boarding', { alert: "Successfully add new boarding information!" })
  } catch (err) {
    res.render('add-boarding', { alert: "Error: Boarding ID existed or Flight ID/Ticket number do not exist!" })
    console.log(err.message)
  }
}

//Open edit form
exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    //append
    q = `SELECT * FROM boarding WHERE boarding_id = ${id}\n`
    await append_queries(q)

    //run query
    const result = await pool.query(
      "SELECT * FROM boarding WHERE boarding_id = $1", [req.params.id])
    const boarding = result.rows
    res.render('edit-boarding', { boarding })
  } catch (err) {
    console.log(err.message)
  }
}

//Edit flight
exports.update = async (req, res) => {
  try {
    const boarding_id = req.params.id
    const {
      flight_id,
      ticket_no,
      boarding_time,
      gate,
      seat_no,
      baggage_id
    } = req.body

    //append
    q = `UPDATE flight SET flight_id= ${flight_id},
    ticket_no = ${ticket_no},
    boarding_time = ${boarding_time},
    gate = ${gate}, 
    seat_no = ${seat_no}, 
    baggage_id = ${baggage_id}
    WHERE boarding_id = ${boarding_id}`
    
    await append_transactions(begin+'\n'+q+'\n'+commit)

    //transaction
    await pool.query(begin)
    await pool.query(
      "UPDATE boarding \
      SET flight_id = $1, \
      ticket_no = $2, \
      boarding_time = $3, \
      gate = $4, \
      seat_no = $5, \
      baggage_id = $6 \
      WHERE boarding_id = $7",
      [flight_id,
        ticket_no,
        boarding_time,
        gate,
        seat_no,
        baggage_id,
        boarding_id]
    )
    await pool.query(commit)

    //run query
    const result = await pool.query("SELECT * FROM boarding WHERE boarding_id = $1", [boarding_id])
    const boarding = result.rows
    res.render('edit-boarding', { boarding, alert: `Boarding ID ${boarding_id} information successfully updated!` })
  } catch (err) {
    const result = await pool.query("SELECT * FROM boarding WHERE boarding_id = $1", [req.params.id])
    const boarding = result.rows
    res.render('edit-boarding', { boarding, alert: "Error: Flight ID/Ticket number do not exist!" })
    console.log(err.message)
  }
}

exports.remove = async (req, res) => {
  try {
    const id = req.params.id
    //append
    q = `DELETE FROM boarding WHERE boarding_id = ${id}`
    await append_transactions(begin+'\n'+q+'\n'+commit)

    //transaction
    await pool.query(begin)
    await pool.query("DELETE FROM boarding WHERE boarding_id = $1", [id])
    await pool.query(commit)

    res.redirect('/boarding')
  } catch (err) {
    console.log(err.message)
  }
}

//View gate
exports.viewGate = async (req, res) => {
  try {
    const id = req.params.id
    //append
    q = `SELECT * FROM gate WHERE gate_no = ${id}\n`
    await append_queries(q)

    //run query
    const result = await pool.query(
      "SELECT * FROM gate WHERE gate_no = $1", [id])
    const gates = result.rows
    res.render('view-gate', { gates })
  } catch (err) {
    console.log(err.message)
  }
}

