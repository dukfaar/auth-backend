import { pubsub } from './pubsub'

export default {
    permissionCreated: {
        subscribe: (a) => { 
            return pubsub.asyncIterator('permission created') 
        }
    },

    roleCreated: {
        subscribe: () => {
            return pubsub.asyncIterator('role created')
        } 
    },

    testSubscription: {
        /*resolve: (payload,args,context,info) => {
            console.log('payload: ')
            console.log(payload)
            console.log(c)
            console.log(d)
            console.log(e)
            return payload
        },*/
        subscribe: (parent, args, ctx, info) => {
            /*console.log('subscribed')
            console.log(parent)
            console.log(args)
            console.log(ctx)
            console.log(info)*/
            return pubsub.asyncIterator('testSubscription')
        }
    }
}