import { RedisPubSub } from 'graphql-redis-subscriptions'
import { PubSub } from 'graphql-subscriptions'
import * as Redis from 'ioredis'

let pubsub

if (process.env.NODE_ENV == 'production') {
    const redisPort: number = process.env.PUBSUB_REDIS_PORT ? Number.parseInt(process.env.PUBSUB_REDIS_PORT) : 6379

    const options = {
        host: process.env.PUBSUB_REDIS_URL || 'localhost',
        port: redisPort,
        retryStrategy: options => {
            // reconnect after
            return Math.max(options.attempt * 100, 3000);
        }
    }

    pubsub = new RedisPubSub({
        publisher: new Redis(options),
        subscriber: new Redis(options)
    })
} else {
    pubsub = new PubSub()
}

export {
    pubsub
}