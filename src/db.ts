import * as mongoose from 'mongoose'
import * as Promise from 'bluebird'
import * as _ from 'lodash'

import { initialData } from './initialData'

import { Client, User, Permission, Role } from './model'

mongoose.Promise = Promise

import { createCrudPermissionsForType } from './util'

mongoose.connect('mongodb://db/auth', {
	useMongoClient: true
})

function initType(type, data, identifyBy) {
	return Promise.all(_.map(data, d => {
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

let crudTypePromise = _.map(initialData.crudTypes, t => createCrudPermissionsForType(t))
let rolePromise = initType(Role, initialData.roles, 'name')
initType(Client, initialData.clients, 'clientId')
let userPromise = initType(User, initialData.users, 'username')

userPromise.then(users => {
	console.log('singleusers: ' + users)
})

Promise.all([userPromise, rolePromise])
.then((users, roles) => {
	console.log('users: ' + users)
	console.log('roles: ' + roles)
})


