import { hasPermission, PermissionError } from 'backend-utilities'

export default (permission: string, handler: Function) => { 
    return (root, params, source, options) => {
        if(hasPermission(source.userPermissions, permission)) {
            return handler(root, params, source, options)
        } else {
            throw new PermissionError(permission)
        }
    }
}