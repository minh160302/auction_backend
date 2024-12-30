// import { createClient } from 'redis';

// const client = createClient({
//     username: 'default',
//     password: 'g1n96w5Et52aAfg2tOFR5evkhqFFDnc0',
//     socket: {
//         host: 'redis-15666.c245.us-east-1-3.ec2.redns.redis-cloud.com',
//         port: 15666
//     }
// });

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar


import { createClient, RedisClientType } from 'redis';

class Cache {
    private static instance: RedisClientType;

    private constructor() { } // Prevent direct instantiation

    public static getInstance(): RedisClientType {
        if (!Cache.instance) {
            Cache.instance = createClient({
                username: 'default',
                password: 'g1n96w5Et52aAfg2tOFR5evkhqFFDnc0',
                socket: {
                    host: 'redis-15666.c245.us-east-1-3.ec2.redns.redis-cloud.com',
                    port: 15666
                }
            });


            Cache.instance.on('connect', () => {
                console.log('Connected to Redis');
            });

            Cache.instance.on('error', (err) => {
                console.error('Redis connection error:', err);
            });

            (async () => {
                try {
                    await Cache.instance.connect();
                } catch (err) {
                    console.error('Redis connection failed:', err);
                }
            })();
        }

        return Cache.instance;
    }
}

export default Cache;
