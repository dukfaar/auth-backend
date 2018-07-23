import * as _ from 'lodash'

import { Permission, Role } from './model'
import { crudFunctionNames } from './crudFunctionNames'

import { nsqPublish } from 'backend-utilities'

async function addPermissionToAdminRole(permission) {
    return Role.findOneAndUpdate({name: 'admin'}, {$push: {permissions: permission.id}}).exec()
    .then(role => {
        nsqPublish('role.updated', role)
        return role
    })
}

export async function tryAddPermission(name: string): Promise<any> {
    let permission = await Permission.findOne({name: name}).exec()
    if(!permission) {
        permission = new Permission({
            name: name
        })
        permission = await permission.save()

        nsqPublish('permission.created', permission)

        addPermissionToAdminRole(permission)
    }
   
    return permission
}

export function createCrudPermissionsForType(typename: string, fields: String[] = []) {
    return Promise.all([
        tryAddPermission(typename),
        ..._.flatMap(crudFunctionNames, 
            functionName => _.map(fields, field => tryAddPermission(`${typename}.${field}.${functionName}`))
        )
    ])
}