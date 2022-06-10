const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Getting a redis client and duplicating a publisher from it.
const {redisClient} = require('./redis-client');
const redisPublisher = redisClient.duplicate();

const connectRedis = async () =>{
  await redisClient.connect();
  await redisPublisher.connect();
}
connectRedis();

// Getting a db client and Creating a table 
const pgClient = require('./db');
const queryString = 'CREATE TABLE IF NOT EXISTS Values (number INT)';
pgClient
  .query(queryString)
  .then((result) => console.log('returned: ',result))
  .catch((err) => {
    console.log('error: ', queryString, '\n', err);
    // process.exit(1);
  })

// Setting up the express 
const app = express();
app.use(cors())
app.use(bodyParser.json())

// Setting up the routes
app.get('/', (req, res) => {
  res.send('Welcome to Fibonacci.')
})

// getting all seen indics from postgres tableName=Values
app.get('/values/all', async (req, res) => {
  try {
    const result = await pgClient.query('SELECT * FROM Values');
    res.send(result.rows);
  }catch(err){
    res.send(err.message);
  }
})

// getting cached index:value pairs from redis hashmap key=values 
app.get('/values/current', async (req, res) => {
  try {
    const result = await redisClient.hGetAll('values');
    res.send(result);
  }catch(err){
    console.log(err)
    res.send(err.message)
  }
})

// publishing an index to redis pubsub channel=new-index for 
// the worker to process and update the hashmap key=values
app.post('/values', async (req, res) => {
  const index = req.body.index ? req.body.index : undefined;
  if (index === undefined || typeof index !== 'number' ) {
    console.log('invalid index value', index);
    return res.status(406).send('Invalid index value');
  }
  //capping the request
  if(parseInt(index) > 40) {
    return res.status(422).send('Out of range index: ' + index);
  }
  console.log('api-server received index: ', index);

  redisClient.hSet('values', index.toString(), 'updating');
  redisPublisher.publish('new-index', index.toString());
  pgClient.query('INSERT INTO Values(number) VALUES($1)', [index]);

  return res.send({working:true})
})

app.listen(5500, err => {
  if (err) console.log(err);
  console.log('Listening on port 5500.');
})