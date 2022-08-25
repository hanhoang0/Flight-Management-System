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
    q = `SELECT * FROM airplane\n`
    await append_queries(q)
    //run query
    const result = await pool.query("SELECT * FROM airplane")
    const airplanes = result.rows
    res.render('airplane', { airplanes })
  } catch (err) {
    console.log(err.message)
  }
}

exports.find = async (req, res) => {
  try {
    const id = req.body.search
    //append
    q = `SELECT * FROM airplane WHERE aircraft_code = ${id}\n`
    await append_queries(q)
    //run query
    const result = await pool.query(
      "SELECT * FROM airplane WHERE aircraft_code = $1", [id])
    const airplanes = result.rows
    res.render('airplane', { airplanes })
  } catch (err) {
    console.log(err.message)
  }
}

//Create new flight
exports.form = (req, res) => res.render('add-airplane')
exports.create = async (req, res) => {
  try {
    const {
      aircraft_code,
      model,
      maintenance_id,
      service_id
    } = req.body
    if (!req.body.aircraft_code || !req.body.model || !req.body.maintenance_id || !req.body.service_id) {
      return res.render('add-airplane', { alert: 'Please fill in the all the information!' })
    }

    //append
    q = `INSERT INTO airplane VALUES 
    (${aircraft_code},${model},${maintenance_id}, ${service_id})`    
    await append_transactions(begin+'\n'+q+'\n'+commit)
    //transaction
    await pool.query(begin)
    await pool.query(
      "INSERT INTO airplane VALUES ($1,$2,$3,$4)",
      [aircraft_code, model, maintenance_id, service_id])
    await pool.query(commit)

    res.render('add-airplane', { alert: "Successfully add new airplane!" })
  } catch (err) {
    res.render('add-airplane', { alert: "Error: Aircraft code/Maintenance ID/Service ID existed or Invalid Input!" })
    console.log(err.message)
  }
}

//Open edit form
exports.edit = async (req, res) => {
  try {
    const id = req.params.id

    //append
    q = `SELECT * FROM airplane WHERE aircraft_code = ${id}\n`
    await append_queries(q)

    //run query
    const result = await pool.query(
      "SELECT * FROM airplane WHERE aircraft_code = $1", [id])
    const airplanes = result.rows
    res.render('edit-airplane', { airplanes })
  } catch (err) {
    console.log(err.message)
  }
}

//Edit flight
exports.update = async (req, res) => {
  try {
    const aircraft_code = req.params.id
    const {model, maintenance_id, service_id} = req.body

    //append
    q = `UPDATE flight SET model = ${model},
    maintenance_id = ${maintenance_id},
    service_id = ${service_id}
    WHERE aircraft_code = ${aircraft_code}"`
    
    await append_transactions(begin+'\n'+q+'\n'+commit)
    //transaction
    await pool.query(begin)
    await pool.query(
      "UPDATE airplane \
      SET model = $1, \
      maintenance_id = $2, \
      service_id = $3 \
      WHERE aircraft_code = $4",
      [model, maintenance_id, service_id, aircraft_code])
    await pool.query(commit)
    
    //query
    const result = await pool.query("SELECT * FROM airplane WHERE aircraft_code = $1", [aircraft_code])
    const airplanes = result.rows
    res.render('edit-airplane', { airplanes, alert: `Airplane ${aircraft_code} successfully updated!` })
  } catch (err) {
    const result = await pool.query("SELECT * FROM airplane WHERE aircraft_code = $1", [req.params.id])
    const airplanes = result.rows
    res.render('edit-airplane', { airplanes, alert: "Error: Maintenance ID/Service ID existed or Invalid Input!" })
    console.log(err.message)
  }
}

/*
exports.remove = async (req, res) => {
  try {
    const aircraft_code = req.params.id

    //append
    q = `DELETE FROM airplane WHERE aircraft_code = ${aircraft_code}`
    await append_transactions(begin+'\n'+q+'\n'+commit)

    //transaction
    await pool.query(begin)
    await pool.query("DELETE FROM airplane WHERE aircraft_code = $1", [aircraft_code])
    await pool.query(commit)
    res.redirect('/airplane')
  } catch (err) {
    console.log(err.message)
  }
}
*/
//View maintenance
exports.viewMaintenance = async (req, res) => {
  try {
    const id = req.params.id
    //append
    q = `SELECT * FROM maintenance WHERE maintenance_id = ${id}\n`
    await append_queries(q)
    //run query
    const result = await pool.query(
      "SELECT * FROM maintenance WHERE maintenance_id = $1", [id])
    const maintenance = result.rows
    res.render('view-maintenance', { maintenance })
  } catch (err) {
    console.log(err.message)
  }
}

//View service
exports.viewService = async (req, res) => {
  try {
    const id = req.params.id
    //append
    q = `SELECT * FROM service WHERE service_id = ${id}\n`
    await append_queries(q)

    //run query
    const result = await pool.query(
      "SELECT * FROM service WHERE service_id = $1", [id])
    const service = result.rows
    res.render('view-service', { service })
  } catch (err) {
    console.log(err.message)
  }
}
