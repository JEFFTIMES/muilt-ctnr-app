import config from './config.js';
import redis from 'redis';

console.log('redisHost: ' + config.redisHost);
console.log('redisPort: ' + config.redisPort);

const socket = {
  host: config.redisHost,
  port: config.redisPort,
  reconnectStrategy: () => 1000
}

const redisClient = redis.createClient({ socket:socket });
redisClient.on('error', (err) => console.log('Redis Client Error', err));

export default redisClient;