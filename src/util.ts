import * as _ from 'lodash'

import { Permission } from './model'
import { crudFunctionNames } from './crudFunctionNames'

export function createCrudPermissionsForType(typename: String) {
    return _.map(crudFunctionNames, functionName => {
        let newName = `${typename} ${functionName}`
        Permission.findOne({name: newName}).exec()
        .then(permission => {
            if(!permission) {
                let newPermission = new Permission()
                newPermission.name = newName
                return newPermission.save()
            }
        })
    })
}