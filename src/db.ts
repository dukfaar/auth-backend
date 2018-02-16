import * as mongoose from 'mongoose'
import * as bluebirdPromise from 'bluebird'
import * as _ from 'lodash'

import { initialData } from './initialData'

import { Client, User, Permission, Role } from './model'

mongoose.Promise = bluebirdPromise

import { createCrudPermissionsForType } from './util'
import { crudFunctionNames } from './crudFunctionNames'

mongoose.connect('mongodb://db/auth', {
	useMongoClient: true
})

function initType(type, data, identifyBy) {
	return bluebirdPromise.all(_.map(data, d => {
		let q = {}
		q[identifyBy] = d[identifyBy]

		return type.findOne(q).exec()
		.then(i => i?i:new type())
		.then(i => _.extend(i, d).save())
		.catch(err => {
			throw err
		}) 
	}))
}

async function assignAdminFullPermissions() {
	return Promise.all([
		User.findOne({username: 'admin'}),
		Role.findOne({name: 'admin'}),
		Permission.find({}).exec()
	])
	.then(([admin, adminRole, permissions]) => {
		permissions.forEach(permission => {
			if(!_.includes(adminRole.permissions, permission._id)) {
				adminRole.permissions.push(permission._id)
			}
		})
	
		adminRole.save()
	
		//check if admin user has the admin role
		if(!_.includes(admin.roles, adminRole._id)) {
			admin.roles.push(adminRole._id)
			admin.save()
		}
	})	
}

let crudTypePromise = _.map(initialData.crudTypes, t => createCrudPermissionsForType(t))
let rolePromise = initType(Role, initialData.roles, 'name')
initType(Client, initialData.clients, 'clientId')
let userPromise = initType(User, initialData.users, 'username')

bluebirdPromise.all([rolePromise, crudTypePromise])
.then(assignAdminFullPermissions)

