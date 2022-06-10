import dotenv from 'dotenv';
dotenv.config();
// console.log('process.env: ',process.env)
export default {
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT
};