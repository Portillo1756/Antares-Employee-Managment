const {Pool} = require('pg');

const pool = new Pool ({
    host: "localhost",
    user: "postgres",
    password: "Real#17Madrid",
    database: "employeeTracker_db",
    port: "5432",
})

module.exports = pool;