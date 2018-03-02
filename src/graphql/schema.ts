import { makeExecutableSchema } from 'graphql-tools'

import * as _ from 'lodash'
import * as Promise from 'bluebird'

import getProjection from './getProjection'

import {
    User,
    Client,
    Token,
    Permission,
    Role
} from '../model'

import typeDefs from './typedefs'

function createType(type, findBy, params): Promise {
    return type.findOne(findBy).lean().exec()
    .then(instance => {
        return instance 
        ?Promise.reject("Can not create new instance")
        :_.extend(new type(), params).save()  
    })
}

function updateType(type, findBy, params): Promise {
    return type.findOne(findBy).exec()
    .then(instance => {
        return instance
        ?_.extend(instance, params).save()   
        :Promise.reject("Can not find instance")                 
    })
}

class PermissionError extends Error {
    message = this.message || 'Permission is missing'
}

const resolvers = {
    User: {
        tokens: (parent, params, context, options) => {
            return Token.find({userId: parent._id}).select(getProjection(options)).lean().exec()
        },
        roles: (parent, params, context, options) => {
            return Role.find({_id: parent.roles}).select(getProjection(options)).lean().exec()
        },
        permissions: (parent, params, context, options) => {
            let roleIdsPromise = parent.roles
            ?Promise.resolve(parent.roles)
            :User.findOne({_id: parent._id}).select('roles').lean().exec().then(user => user.roles)
            
            return roleIdsPromise.then(roleIds => {
                return Role.find({_id: roleIds}).select('permissions').lean().exec()
            })
            .then(roles => {
                return _.uniq(_.flatMap(roles, role => role.permissions))
            })
            .then(permissionIds => {
                return Permission.find({_id: permissionIds}).select(getProjection(options)).lean().exec()
            })
        },
    },

    Client: {
        tokens: (parent, params, context, options) => {
            return Token.find({clientId: parent._id}).select(getProjection(options)).lean().exec()
        }
    },

    Role: {
        permissions: (parent, params, context, options) => {
            return Permission.find({_id: parent.permissions}).select(getProjection(options)).lean().exec()
        }
    },

    Query: {
        clients: (root, params, source, options) => {
            return Client.find().select(getProjection(options)).lean().exec()
        },
        users: (root, params, source, options) => {
            return User.find().select(getProjection(options)).lean().exec()
        },
        me: (root, params, source, options) => {
            if(source.token && source.token.userId) {
                return User.findOne({ _id: source.token.userId }).select(getProjection(options)).lean().exec()
            } else {
                throw "valid accesstoken is required"
            }
        },
        tokens: (root, params, source, options) => {
            return Token.find().select(getProjection(options)).lean().exec()
        },
        permissions: (root, params, source, options) => {
            if(_.find(source.userPermissions,p => p.name === 'permission read')) {
                return Permission.find().select(getProjection(options)).lean().exec()
            } else {
                throw new PermissionError()
            }           
        },
        roles: (root, params, source, options) => {
            return Role.find().select(getProjection(options)).lean().exec()
        },
    },

    Mutation: {
        createClient: (value, params) => {
            return createType(Client, {clientId: params.clientId}, params)      
        },
    
        updateClient:  (value, params) => {
            return updateType(Client, {clientId: params.clientId}, params)                
        },

        deleteClient: (value, {clientId}) => {
            return Client.remove({clientId: clientId}).exec()
        },

        createUser: (value, params) => {
            return createType(User, {username: params.username}, params)   
        },
    
        updateUser:  (value, params) => {
            return updateType(User, {username: params.username}, params.user)                 
        },

        deleteUser: (value, {username}) => {
            return User.remove({username: username}).exec()
        },

        createPermission: (value, params) => {
            return createType(Permission, {name: params.name}, params)      
        },

        updatePermission: (value, params) => {
            return updateType(Permission, {name: params.name}, params.permission)      
        },

        deletePermission: (value, {name}) => {
            return Permission.remove({name: name}).exec()
        },

        createRole: (value, params) => {
            return createType(Role, {name: params.name}, params)      
        },
    
        updateRole:  (value, params) => {
            return updateType(Role, {name: params.name}, params.role)                
        },

        deleteRole: (value, {name}) => {
            return Role.remove({name: name}).exec()
        },

    }  
}

export const Schema = makeExecutableSchema({
    typeDefs,
    resolvers,
})
