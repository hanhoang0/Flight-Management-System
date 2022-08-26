const { Pool } = require('pg');

// const pool = new Pool({
//   host: "3380db.cs.uh.edu",
//   user: "dbs042",
//   password: "2088807H",
//   database: "COSC3380",
//   port: 5432
// });
const pool = new Pool({
  host: "kashin.db.elephantsql.com",
  user: "onkwqgmw",
  password: "a6PHKnm_J7dhj58jKcXvyc06cKR3seMF",
  database: "onkwqgmw",
  port: 5432
});


module.exports = pool;