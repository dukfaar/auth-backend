import {
    requireTypePermissions
} from 'backend-utilities'

import {
    clientHelper,
    userHelper,
    roleHelper,
    permissionHelper
} from './mongooseHelpers'

export default {
    permissionCreated: { resolve: value => value, subscribe: permissionHelper.subscribeCreated.bind(permissionHelper) },
    permissionUpdated: { resolve: value => value, subscribe: permissionHelper.subscribeUpdated.bind(permissionHelper) },
    permissionDeleted: { resolve: value => value, subscribe: permissionHelper.subscribeDeleted.bind(permissionHelper) },

    roleCreated: { resolve: value => value, subscribe: roleHelper.subscribeCreated.bind(roleHelper) },
    roleUpdated: { resolve: value => value, subscribe: roleHelper.subscribeUpdated.bind(roleHelper) },
    roleDeleted: { resolve: value => value, subscribe: roleHelper.subscribeDeleted.bind(roleHelper) },

    userCreated: { resolve: value => value, subscribe: userHelper.subscribeCreated.bind(userHelper) },
    userUpdated: { resolve: value => value, subscribe: userHelper.subscribeUpdated.bind(userHelper) },
    userDeleted: { resolve: value => value, subscribe: userHelper.subscribeDeleted.bind(userHelper) },

    clientCreated: { resolve: value => value, subscribe: clientHelper.subscribeCreated.bind(clientHelper) },
    clientUpdated: { resolve: value => value, subscribe: clientHelper.subscribeUpdated.bind(clientHelper) },
    clientDeleted: { resolve: value => value, subscribe: clientHelper.subscribeDeleted.bind(clientHelper) },
}