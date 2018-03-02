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

import queryResolvers from './queryResolvers'
import mutationResolvers from './mutationResolvers' 

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

    Query: queryResolvers,

    Mutation: mutationResolvers
}

export const Schema = makeExecutableSchema({
    typeDefs,
    resolvers,
})
