import * as _ from 'lodash'

import {
    mongooseCreateType as createType,
    mongooseUpdateType as updateType,
    requirePermission
  } from 'backend-utilities'

import {
    User,
    Client,
    Token,
    Permission,
    Role
} from '../model'

import {
    createCrudPermissionsForType
} from '../util'

export default {
    createClient: (value, params) => createType(Client, {clientId: params.clientId}, params),  
    updateClient: (value, params) => updateType(Client, {clientId: params.clientId}, params),
    deleteClient: (value, params) => Client.remove({clientId: params.clientId}).exec(),

    createUser: (value, params) => createType(User, {username: params.username}, params),  
    updateUser: (value, params) => updateType(User, {username: params.username}, params),
    deleteUser: (value, params) => User.remove({username: params.username}).exec(),

    createPermission: (value, params) => createType(Permission, {name: params.name}, params),  
    updatePermission: (value, params) => updateType(Permission, {name: params.name}, params),
    deletePermissionByName: (value, params) => Permission.remove({name: params.name}).exec(),

    createRole: (value, params) => createType(Role, {name: params.name}, params),  
    updateRole: (value, params) => updateType(Role, {name: params.name}, params),
    deleteRole: (value, params) => Role.remove({name: params.name}).exec(),

    registerTypeForPermissions: (value, params, context):Promise<any> => {
        requirePermission(context.userPermissions, 'registerTypeForPermissions')

        return createCrudPermissionsForType(params.name, params.fields)
    }
}  