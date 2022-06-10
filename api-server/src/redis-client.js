const redis = require('redis');
const config = require('./config')


console.log('redisHost: ' + config.redisHost);
console.log('redisPort: ' + config.redisPort);

const socket = {
  host: config.redisHost,
  port: config.redisPort,
  reconnectStrategy: () => 1000
}

const redisClient = redis.createClient({ socket:socket });
redisClient.on('error', (err) => console.log('Redis Client Error', err));

module.exports = {
  redisClient: redisClient
}