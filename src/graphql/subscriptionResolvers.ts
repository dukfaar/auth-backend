import {
    clientHelper,
    userHelper,
    roleHelper,
    permissionHelper
} from './mongooseHelpers'

export default {
    permissionCreated: { subscribe: a => permissionHelper.subscribeCreated() },
    permissionUpdated: { subscribe: a => permissionHelper.subscribeUpdated() },
    permissionDeleted: { subscribe: a => permissionHelper.subscribeDeleted() },

    roleCreated: { subscribe: a => roleHelper.subscribeCreated() },
    roleUpdated: { subscribe: a => roleHelper.subscribeUpdated() },
    roleDeleted: { subscribe: a => roleHelper.subscribeDeleted() },

    userCreated: { subscribe: a => userHelper.subscribeCreated() },
    userUpdated: { subscribe: a => userHelper.subscribeUpdated() },
    userDeleted: { subscribe: a => userHelper.subscribeDeleted() },

    clientCreated: { subscribe: a => clientHelper.subscribeCreated() },
    clientUpdated: { subscribe: a => clientHelper.subscribeUpdated() },
    clientDeleted: { subscribe: a => clientHelper.subscribeDeleted() },
}