import { MongooseHelper } from 'backend-utilities'

import {
    User,
    Client,
    Token,
    Permission,
    Role
} from '../model'

import { pubsub } from './pubsub'

export const clientHelper = new MongooseHelper(Client, 'clientId', pubsub)
export const userHelper = new MongooseHelper(User, 'username', pubsub)
export const roleHelper = new MongooseHelper(Role, 'name', pubsub)
export const permissionHelper = new MongooseHelper(Permission, 'name', pubsub)