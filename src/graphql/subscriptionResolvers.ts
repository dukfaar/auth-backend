import { pubsub } from './pubsub'

export default {
    permissionCreated: {
        resolve: (payload) => {
            console.log('payload: ')
            console.log(payload)
            return payload
        },
        subscribe: (a) => { 
            console.log('subscribed')
            console.log(a)
            return pubsub.asyncIterator('permission created') 
        }
    },

    testSubscription: {
        resolve: (payload,c,d,e) => {
            console.log('payload: ')
            console.log(payload)
            console.log(c)
            console.log(d)
            console.log(e)
            return {}
        },
        subscribe: (parent, args, ctx, info) => {
            console.log('subscribed')
            console.log(parent)
            console.log(args)
            console.log(ctx)
            console.log(info)
            return pubsub.asyncIterator('testSubscription')
        }
    }
}