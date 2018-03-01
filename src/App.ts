import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as expressOAuthServer from 'express-oauth-server'
import * as dataloader from 'dataloader'

import NodeCache from 'node-cache'

var oauthServer = require('oauth2-server')
var Request = oauthServer.Request
var Response = oauthServer.Response

import * as Model from './oauthModelUtil'
import './db'

import * as _ from 'lodash'

import { Schema } from './graphql/schema'

import * as graphqlHTTP from 'express-graphql'

import { User } from './model/User'
import { Role } from './model/Role'
import { Permission } from './model/Permission'

import fetchFromCache from './fetchFromCache'

export class App {
	private expressApp
	private userCache
	private userPermissionCache
	private port = process.env.PORT || 3000

	private oauthServer
	private oauthModel = {
		getAccessToken: Model.getAccessToken,
		getRefreshToken: Model.getRefreshToken,
		getClient: Model.getClient,
		getUser: Model.getUser,
		saveToken: Model.saveToken,
		getUserFromClient: Model.getUserFromClient,
		revokeToken: Model.revokeToken
	}

	public constructor() {
		this.expressApp = express()
		this.oauthServer = new expressOAuthServer({
			model: this.oauthModel
		})

		this.expressApp.use(bodyParser.json())
		this.expressApp.use(bodyParser.urlencoded({extended: false}))	
		
		this.expressApp.use('*', (req, res, next) => {
			res.header('Access-Control-Allow-Origin', '*')
			res.header('Access-Control-Allow-Credentials', true)
			res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
			res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
			next()
		})

		this.expressApp.options('*', (req, res) => { res.send('OK') })

		this.userCache = new NodeCache({stdTTL: 100, checkPeriod: 120})
		this.userPermissionCache = new NodeCache({stdTTL: 100, checkPeriod: 120})
	}
 
	public start() {
		this.loadRoutes()

		this.listen()
	}

	
	private async loadRoutes() {
		console.log('loading routes')

		this.expressApp.post('/oauth/token', this.oauthServer.token())

		this.expressApp.use('/', (req, res, next) => {
			this.oauthServer.server.authenticate(new Request(req), new Response(res))
			.then(async token => {
				req.token = token
				req.user = await fetchFromCache(this.userCache, token.userId, key => User.findOne({_id: token.userId}).select('roles').lean().exec())

				req.userPermissions = await fetchFromCache(this.userPermissionCache, token.userId, async key => {
					let roles = await Role.find({_id: req.user.roles }).select('permissions').lean().exec()
					let permissionIds = _.uniq(_.flatMap(roles, role => role.permissions))
					return await Permission.find({_id: permissionIds}).select('name').lean().exec()
				})

				next()
			})
			.catch(error => {
				req.token = null
				req.authError = error
				req.userPermissions = []
				next()
			})
		},
			graphqlHTTP(req => ({
				schema: Schema,
				graphiql: true, //Set to false if you don't want graphiql enabled,
				context: {
					token: req.token
				}
			}))
		)

		console.log('done loading routes')
	}

	private listen(): void {
		this.expressApp.listen(this.port, (err) => {
			if (err) throw err

			return console.log(`server is listening on ${this.port}`)
		})
	}
}
