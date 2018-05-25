import { hash } from 'bcryptjs'

import { User, Role, Permission, Client } from './model'

import { tryAddPermission } from './util'

export default async () => {
    let adminRole = await Role.findOne({name: 'admin'}).exec()
    if(!adminRole) {
        adminRole = new Role({
            name: 'admin',
        })
        adminRole = await adminRole.save()
    }

    let adminUser = await User.findOne({username: 'admin'}).exec()
    if(!adminUser) {
        adminUser = new User({
            username: 'admin', 
            password: await hash('secretpassword', 10),
            email: 'dukfaar@gmail.com',
            roles: [adminRole._id]
        })
        adminUser = await adminUser.save()
    }

    tryAddPermission('registerTypeForPermissions')

    let initialClient = await Client.findOne({clientId: 'initialClientId'}).exec()
    if(!initialClient) {
        initialClient = new Client({
            clientId: 'initialClientId',
            clientSecret: 'initialClientSecret',
            grants: ['password', 'refresh_token']
        })
        initialClient = await initialClient.save()
    }
}