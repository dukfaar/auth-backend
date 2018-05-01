import * as _ from 'lodash'

import { Permission, Role } from './model'
import { crudFunctionNames } from './crudFunctionNames'

async function addPermissionToAdminRole(permission) {
    let adminRole:any = await Role.findOne({name: 'admin'}).exec()
    if(adminRole) {
        if(!_.find(adminRole.permissions, p => p == permission.id)) {
            adminRole.permissions.push(permission._id)
            await adminRole.save()
        }
    }
}

export async function tryAddPermission(name: string): Promise<any> {
    let permission = await Permission.findOne({name: name}).exec()
    if(!permission) {
        permission = new Permission({
            name: name
        })
        permission = await permission.save()
    }

    addPermissionToAdminRole(permission)
     
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