import * as _ from 'lodash'

import {
    mongooseCreateType as createType,
    mongooseUpdateType as updateType,
    requirePermission,
} from 'backend-utilities'

import {
    User,
    Client,
    Token,
    Permission,
    Role
} from '../model'

import {
    createCrudPermissionsForType,
    tryAddPermission
} from '../util'

import {
    clientHelper,
    userHelper,
    roleHelper,
    permissionHelper
} from './mongooseHelpers'

export default {
    createClient: (value, params) => clientHelper.create(params),  
    updateClient: (value, params) => clientHelper.update(params),
    deleteClient: (value, params) => clientHelper.delete(params),

    createUser: (value, params) => userHelper.create(params),  
    updateUser: (value, params) => userHelper.update(params),
    deleteUser: (value, params) => userHelper.delete(params),

    createPermission: (value, params) => permissionHelper.create(params),  
    updatePermission: (value, params) => permissionHelper.update(params),
    deletePermissionByName: (value, params) => permissionHelper.delete(params),

    createRole: (value, params) => roleHelper.create(params),  
    updateRole: (value, params) => roleHelper.update(params),
    deleteRole: (value, params) => roleHelper.delete(params),

    registerTypeForPermissions: (value, params, context):Promise<any> => {
        requirePermission(context.userPermissions, 'mutation.registerTypeForPermissions')

        return createCrudPermissionsForType(params.name, params.fields)
    },

    registerQuery: (value, params, context) => {
        requirePermission(context.userPermissions, 'mutation.registerQuery')

        return tryAddPermission(`query.${params.name}`)
    },

    registerMutation: (value, params, context) => {
        requirePermission(context.userPermissions, 'mutation.registerMutation')

        return tryAddPermission(`mutation.${params.name}`)
    },

    registerSubscription: (value, params, context) => {
        requirePermission(context.userPermissions, 'mutation.registerSubscription')

        return tryAddPermission(`subscription.${params.name}`)
    },
}  