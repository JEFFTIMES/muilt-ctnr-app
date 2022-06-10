const config = require('./config')
const { Pool } = require('pg');

const pool = new Pool({
  user: config.pgUser,
  host: config.pgHost,
  database: config.pgDatabase,
  password: config.pgPassword,
  port: config.pgPort
})
pool.on('error', () => console.log('Lost connection to database.'))

module.exports = {
  query: async (text, params) =>{
    try {
      const start = Date.now();
      const result =  await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('execute query: ', { text, duration, rows: result.rowCount });
      return result;
    } catch (err) {
      console.log('error query: ', err.stack)
    }
  }
}
