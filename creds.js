const { Pool } = require('pg');

const pool = new Pool({
  host: "3380db.cs.uh.edu",
  user: "dbs042",
  password: "2088807H",
  database: "COSC3380",
  port: 5432
});

module.exports = pool;