import { createClient, RedisClientType } from 'redis';

class Cache {
    private static instance: RedisClientType;

    private constructor() { } // Prevent direct instantiation

    public static getInstance(): RedisClientType {
        if (!Cache.instance) {
            Cache.instance = createClient({
                username: process.env.REDIS_USERNAME,
                password: process.env.REDIS_PASSWORD,
                socket: {
                    host: process.env.REDIS_HOST,
                    port: parseInt(process.env.REDIS_PORT || "6379")
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
