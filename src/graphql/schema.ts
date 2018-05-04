import { makeExecutableSchema } from 'graphql-tools'

import * as _ from 'lodash'

import { 
    getProjection,
    RelayHelper,
    RelayHelperFactory
} from 'backend-utilities'

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
import subscriptionResolvers from './subscriptionResolvers'

const tokenRelayHelperFactor = new RelayHelperFactory(Token, 'token')
const roleRelayHelperFactor = new RelayHelperFactory(Role, 'role')
const userRelayHelperFactor = new RelayHelperFactory(User, 'user')
const clientRelayHelperFactor = new RelayHelperFactory(Client, 'client')
const permissionRelayHelperFactor = new RelayHelperFactory(Permission, 'permission')

const resolvers = {
    User: {
        tokens: (parent, params, source, options) => {
            return tokenRelayHelperFactor.createHelper({findFactory: () => Token.find({userId: parent._id}),params, source, options}).performRelayQuery()
        },
        roles: (parent, params, source, options) => {
            return roleRelayHelperFactor.createHelper({findFactory: () => Role.find({_id : parent.roles}), params, source, options}).performRelayQuery()
        },
        permissions: (parent, params, source, options) => {
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
                return permissionRelayHelperFactor
                .createHelper({
                    findFactory: () => Permission.find({_id: permissionIds}),
                    params, source, options
                })
                .performRelayQuery()
            })
        },
    },

    Client: {
        tokens: (parent, params, source, options) => {
            return tokenRelayHelperFactor
            .createHelper({
                findFactory: () => Token.find({clientId: parent._id}),
                params, source, options
            }).performRelayQuery()
        }
    },

    Role: {
        permissions: (parent, params, source, options) => {
            return permissionRelayHelperFactor
            .createHelper({
                findFactory: () => Permission.find({_id: parent.permissions}),
                params, source, options
            }).performRelayQuery()
        }
    },

    Query: queryResolvers,

    Mutation: mutationResolvers,

    Subscription: subscriptionResolvers
}

export const Schema = makeExecutableSchema({
    typeDefs,
    resolvers,
})
