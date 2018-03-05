import * as _ from 'lodash'

import PermissionError from './PermissionError'

function hasPermission(source, permission) {
    return _.find(source.userPermissions, p => p.name === permission)
}

export default (permission: string, handler: Function) => { 
    return (root, params, source, options) => {
        if(hasPermission(source, permission)) {
            return handler(root, params, source, options)
        } else {
            throw new PermissionError(permission)
        }
    }
}