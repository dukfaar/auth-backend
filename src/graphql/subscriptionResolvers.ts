import { pubsub } from './pubsub'

export default {
    permissionCreated: {
        resolve: (payload) => {
            console.log('payload: ')
            console.log(payload)
            return payload
        },
        subscribe: () => { 
            console.log('subscribed')
            pubsub.asyncIterator('permission created') 
        }
    }
}