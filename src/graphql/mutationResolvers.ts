import * as Promise from 'bluebird'
import * as _ from 'lodash'

import {
    mongooseCreateType as createType,
    mongooseUpdateType as updateType 
  } from 'backend-utilities'

import {
    User,
    Client,
    Token,
    Permission,
    Role
} from '../model'

import withAuth from './withAuth'

export default {
    createClient: withAuth('client create', (value, params) => createType(Client, {clientId: params.clientId}, params)),  
    updateClient: withAuth('client update', (value, params) => updateType(Client, {clientId: params.clientId}, params)),
    deleteClient: withAuth('client delete', (value, params) => Client.remove({clientId: params.clientId}).exec()),

    createUser: withAuth('user create', (value, params) => createType(User, {username: params.username}, params)),  
    updateUser: withAuth('user update', (value, params) => updateType(User, {username: params.username}, params)),
    deleteUser: withAuth('user delete', (value, params) => User.remove({username: params.usernam}).exec()),

    createPermission: withAuth('permission create', (value, params) => createType(Permission, {name: params.name}, params)),  
    updatePermission: withAuth('permission update', (value, params) => updateType(Permission, {name: params.name}, params)),
    deletePermission: withAuth('permission delete', (value, params) => Permission.remove({username: params.name}).exec()),

    createRole: withAuth('role create', (value, params) => createType(Role, {name: params.name}, params)),  
    updateRole: withAuth('role update', (value, params) => updateType(Role, {name: params.name}, params)),
    deleteRole: withAuth('role delete', (value, params) => Role.remove({name: params.name}).exec()),
}  