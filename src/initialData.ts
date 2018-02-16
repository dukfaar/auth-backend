import * as _ from 'lodash'
import { crudFunctionNames } from './crudFunctionNames'

const initialData = {
    clients: [
        { clientId: 'dukfaar-cloud-internal', clientSecret: 'i am a ninja cat', grants: ['client_credentials'] },
        { clientId: 'dukfaar-ui-app', clientSecret: 'i am a ninja unicorn', grants: ['password', 'refresh_token'] }
    ],
    users: [
        { username: 'admin', password: 'secretpassword', email: 'dukfaar@gmail.com' },
        { username: 'dukfaar-cloud-internal', password: 'this password will actually never be used', email: 'dukfaar@gmail.com' }
    ],
    roles: _.map([ 'admin' ], rName => ({name: rName})),
    crudTypes: ['client', 'user', 'role', 'permission', 'token']
}

export { initialData }