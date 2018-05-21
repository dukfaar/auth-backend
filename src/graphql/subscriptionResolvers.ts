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
    permissionCreated: { subscribe: permissionHelper.subscribeCreated },
    permissionUpdated: { subscribe: permissionHelper.subscribeUpdated },
    permissionDeleted: { subscribe: permissionHelper.subscribeDeleted },

    roleCreated: { subscribe: roleHelper.subscribeCreated },
    roleUpdated: { subscribe: roleHelper.subscribeUpdated },
    roleDeleted: { subscribe: roleHelper.subscribeDeleted },

    userCreated: { subscribe: userHelper.subscribeCreated },
    userUpdated: { subscribe: userHelper.subscribeUpdated },
    userDeleted: { subscribe: userHelper.subscribeDeleted },

    clientCreated: { subscribe: clientHelper.subscribeCreated },
    clientUpdated: { subscribe: clientHelper.subscribeUpdated },
    clientDeleted: { subscribe: clientHelper.subscribeDeleted },
}