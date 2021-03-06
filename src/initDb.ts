import { hash } from 'bcryptjs'

import { User, Role, Permission, Client } from './model'

import { tryAddPermission, createCrudPermissionsForType } from './util'

export default async () => {
    let adminRole = await Role.findOne({name: 'admin'}).exec()
    if(!adminRole) {
        adminRole = new Role({
            name: 'admin',
        })
        adminRole = await adminRole.save()
    }

    let adminUser:any = await User.findOne({username: 'admin'}).exec()
    let adminPWhash = await hash('secretpassword', 10)
    if(!adminUser) {
        adminUser = new User({
            username: 'admin', 
            password: adminPWhash,
            email: 'dukfaar@gmail.com',
            roles: [adminRole._id]
        })
        adminUser = await adminUser.save()
    } else {
        if(adminUser.password !== adminPWhash) {
            adminUser.password = adminPWhash
            adminUser = await adminUser.save()
        }
    }

    tryAddPermission('mutation.registerTypeForPermissions')
    tryAddPermission('mutation.registerMutation')
    tryAddPermission('mutation.registerQuery')
    tryAddPermission('mutation.registerSubscription')

    await createCrudPermissionsForType("client", ["_id","clientId", "clientSecret", "grants"])
    await createCrudPermissionsForType("permission", ["_id","name"])
    await createCrudPermissionsForType("role", ["_id","name", "permissions"])
    await createCrudPermissionsForType("token", ["_id","accessToken","accessTokenExpiresAt", "client", "clientId", "refreshToken","refreshTokenExpiresAt","user", "userId"])
    await createCrudPermissionsForType("user", ["_id","email", "username", "password", "roles", "permissions"])

    let initialClient = await Client.findOne({clientId: 'initialClientId'}).exec()
    if(!initialClient) {
        initialClient = new Client({
            clientId: 'initialClientId',
            clientSecret: 'initialClientSecret',
            grants: ['password', 'refresh_token']
        })
        initialClient = await initialClient.save()
    }

    let initialClientUser = await User.findOne({username: 'initialClientId'}).exec()
    if(!initialClientUser) {
        initialClientUser = new User({
            username: 'initialClientId', 
            password: 'password is not used',
            email: 'empty',
            roles: [adminRole._id]
        })
        initialClientUser = await initialClientUser.save()
    }

    let cloudInternalClient = await Client.findOne({clientId: 'dukfaar-cloud-internal'}).exec()
    if(!cloudInternalClient) {
        cloudInternalClient = new Client({
            clientId: 'dukfaar-cloud-internal',
            clientSecret: 'i am a ninja cat',
            grants: ['client_credentials']
        })
        cloudInternalClient = await cloudInternalClient.save()
    }

    let cloudInternalUser = await User.findOne({username: 'dukfaar-cloud-internal'}).exec()
    if(!cloudInternalUser) {
        cloudInternalUser = new User({
            username: 'dukfaar-cloud-internal', 
            password: 'password is not used',
            email: 'empty',
            roles: [adminRole._id]
        })
        cloudInternalUser = await cloudInternalUser.save()
    }


}