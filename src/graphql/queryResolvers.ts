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

import { getProjection } from 'backend-utilities'

import withAuth from './withAuth'

export default {
    clients: withAuth('client read', (root, params, source, options) => Client.find().select(getProjection(options)).lean().exec()),
    users: withAuth('user read', (root, params, source, options) => User.find().select(getProjection(options)).lean().exec()),
    me: (root, params, source, options) => {
        if(source.token && source.token.userId) {
            return User.findOne({ _id: source.token.userId }).select(getProjection(options)).lean().exec()
        } else {
            throw "valid accesstoken is required"
        }
    },
    tokens: withAuth('token read', (root, params, source, options) => Token.find().select(getProjection(options)).lean().exec()),
    permissions: withAuth('permission read', (root, params, source, options) => Permission.find().select(getProjection(options)).lean().exec()),
    roles: withAuth('role read', (root, params, source, options) => Role.find().select(getProjection(options)).lean().exec()),

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

        return getOAuthServer().token(request, response, {})
    }
}