import redisClient from './redis-client.js'

function fibonacci(index){
  //console.log('fib: ', index);
  if (index === 1 || index === 2) return 1;
  return fibonacci(index - 1) + fibonacci(index - 2);
}

async function processFib(sub){
  
  sub.subscribe('new-index', (message) =>{
    console.log('worker receives published index: ', message, typeof message)
    redisClient.hSet(
      'values', 
      message, 
      fibonacci(parseInt(message))
    );
  })
}

await redisClient.connect();
await redisClient.set('worker', 'worker is on');
const checkIn = await redisClient.get('worker');
console.log('worker check in: ', checkIn);

const redisSubscriber = redisClient.duplicate();
await redisSubscriber.connect();

await processFib(redisSubscriber);

