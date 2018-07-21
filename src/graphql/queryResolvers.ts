import {
    User,
    Client,
    Token,
    Permission,
    Role
} from '../model'

import { getOAuthServer } from '../oauthServer'

var oauthServer = require('oauth2-server')
var Request = oauthServer.Request
var Response = oauthServer.Response

import { 
    getProjection, 
    requireTypePermissions, 
    requirePermission, 
    Operation,
    RelayHelper,
    RelayHelperFactory,
    getProjectionForPath
} from 'backend-utilities'

import withAuth from './withAuth'

import * as _ from 'lodash'

import {nsqPublish} from 'backend-utilities'

const tokenRelayHelperFactory = new RelayHelperFactory(Token, 'token')
const roleRelayHelperFactory = new RelayHelperFactory(Role, 'role')
const userRelayHelperFactory = new RelayHelperFactory(User, 'user')
const clientRelayHelperFactory = new RelayHelperFactory(Client, 'client')
const permissionRelayHelperFactory = new RelayHelperFactory(Permission, 'permission')

export default {
    clients: (root, params, source, options) => {
        return clientRelayHelperFactory.createHelper({params, source, options}).performRelayQuery()
    },
    users:  (root, params, source, options) => {
        return userRelayHelperFactory.createHelper({params, source, options}).performRelayQuery()
    },
    tokens: (root, params, source, options) => {
        return tokenRelayHelperFactory.createHelper({params, source, options}).performRelayQuery()
    },
    permissions: async (root, params, source, options) => {
        return permissionRelayHelperFactory.createHelper({params, source, options}).performRelayQuery()
    },
    roles: (root, params, source, options) => {
        return roleRelayHelperFactory.createHelper({params, source, options}).performRelayQuery()
    },

    me: (root, params, source, options) => {
        if(source.token && source.token.userId) {
            return User.findOne({ _id: source.token.userId }).select(getProjection(options)).lean().exec()
        } else {
            throw "valid accesstoken is required"
        }
    },

    login: (root, params, source, options) => {
        let request = new Request({
            method: 'POST',
            query: {},
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${params.clientId}:${params.clientSecret}`).toString('base64'),
                "Content-Type": 'application/x-www-form-urlencoded',
                "transfer-encoding": '',
                "content-length": 0
            },
            body: {
                username: params.username,
                password: params.password,
                grant_type: 'password'
            }
        })
        let response = new Response({})

        let loginResult = getOAuthServer().token(request, response, {})

        loginResult.then(result => {
            nsqPublish('login.success', {
                userId: result.userId,
                accessToken: result.accessToken,
                accessTokenExpiresAt: result.accessTokenExpiresAt
            })
        })
        .catch(error => {
            nsqPublish('login.failed', {
                username: params.username,
                clientId: params.clientId,
                clientSecret: params.clientSecret,
                error: error
            })
        })

        return loginResult
    },

    clientlogin: (root, params, source, options) => {
        let request = new Request({
            method: 'POST',
            query: {},
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${params.clientId}:${params.clientSecret}`).toString('base64'),
                "Content-Type": 'application/x-www-form-urlencoded',
                "transfer-encoding": '',
                "content-length": 0
            },
            body: {
                grant_type: 'client_credentials'
            }
        })
        let response = new Response({})

        let loginResult = getOAuthServer().token(request, response, {})

        loginResult.then(console.log)

        loginResult.then(result => {
            nsqPublish('login.success', {
                userId: result.userId,
                accessToken: result.accessToken,
                accessTokenExpiresAt: result.accessTokenExpiresAt
            })
        })
        .catch(error => {
            nsqPublish('login.failed', {
                clientId: params.clientId,
                clientSecret: params.clientSecret,
                error: error
            })
        })

        return loginResult
    },

    refresh: (root, params, source, options) => {
        let request = new Request({
            method: 'POST',
            query: {},
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${params.clientId}:${params.clientSecret}`).toString('base64'),
                "Content-Type": 'application/x-www-form-urlencoded',
                "transfer-encoding": '',
                "content-length": 0
            },
            body: {
                refresh_token: params.refreshToken,
                grant_type: 'refresh_token'
            }
        })
        let response = new Response({})

        let refreshResult = getOAuthServer().token(request, response, {})

        refreshResult.then(result => {
            nsqPublish('accesstoken.refresh.success', {
                userId: result.userId,
                accessToken: result.accessToken,
                accessTokenExpiresAt: result.accessTokenExpiresAt
            })
        })
        .catch(error => {
            nsqPublish('accesstoken.refresh.failed', {
                refreshToken: params.refreshToken,
                clientId: params.clientId,
                clientSecret: params.clientSecret,
                error: error
            })
        })

        return refreshResult
    },

    user: async(root, params, source, options) => {
        let projection = getProjection(options)
        requireTypePermissions(source.userPermissions, 'user', projection, Operation.READ)

        if(params.id) {
            return User.findOne({_id: params.id}).select(projection).lean().exec()
        } else throw "Unknown Query Parameters"
    },

    role: async(root, params, source, options) => {
        let projection = getProjection(options)
        requireTypePermissions(source.userPermissions, 'role', projection, Operation.READ)

        if(params.id) {
            return Role.findOne({_id: params.id}).select(projection).lean().exec()
        } else throw "Unknown Query Parameters"
    },

    userByAccessToken: async (root, params, source, options) => {
        requirePermission(source.userPermissions, 'userByAccessToken')
        let projection = getProjection(options)
        requireTypePermissions(source.userPermissions, 'user', projection, Operation.READ)

        let token = await Token.findOne({ accessToken: params.accessToken }).select('userId').lean().exec()
        return User.findOne({_id: token.userId}).select(projection).lean().exec()
    },
}