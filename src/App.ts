import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as dataloader from 'dataloader'
import { createServer } from 'http'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'

import * as NodeCache from 'node-cache'

import './db'
import initDb from './initDb'

import * as _ from 'lodash'

var oauthServer = require('oauth2-server')
var Request = oauthServer.Request
var Response = oauthServer.Response

import { Schema } from './graphql/schema'

import * as graphqlHTTP from 'express-graphql'

import { User } from './model/User'
import { Role } from './model/Role'
import { Permission } from './model/Permission'

import fetchFromCache from './fetchFromCache'

import { getOAuthServer } from './oauthServer'

export class App {
	private expressApp
	private expressServer
	private userCache
	private userPermissionCache
	private port = process.env.PORT || 3000

	public constructor() {
		this.expressApp = express()
		this.expressServer = createServer(this.expressApp)
		
		this.expressApp.use(bodyParser.json())
		this.expressApp.use(cookieParser())
		this.expressApp.use(bodyParser.urlencoded({extended: false}))	
		
		this.expressApp.use('*', (req, res, next) => {
			res.header('Access-Control-Allow-Origin', '*')
			res.header('Access-Control-Allow-Credentials', true)
			res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT')
			res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
			res.header('Access-Control-Max-Age', '600')
			next()
		})

		this.expressApp.options('*', (req, res) => { res.send('OK') })

		this.userCache = new NodeCache({stdTTL: 100, checkperiod: 120})
		this.userPermissionCache = new NodeCache({stdTTL: 100, checkperiod: 120})

		initDb()
	}
 
	public start() {
		this.loadRoutes()

		this.listen()
	}

	private async loadRoutes() {
		console.log('loading routes')

		this.expressApp.use('/', (req, res, next) => {
			getOAuthServer().authenticate(
				new Request(req), 
				new Response(res)
			)
			.then(async token => {	
				req.token = token

				req.user = await fetchFromCache(this.userCache, token.userId, 
					key => User.findOne({_id: token.userId}).select('roles').lean().exec()
				)

				req.userPermissions = await fetchFromCache(this.userPermissionCache, token.userId, 
					async key => {
						let roles = await Role.find({_id: req.user.roles }).select('permissions').lean().exec()
						let permissionIds = _.uniq(_.flatMap(roles, role => role.permissions))
						let permissionObjects = await Permission.find({_id: permissionIds}).select('name').lean().exec()
						return _.map(permissionObjects, permission => permission.name)
					}
				)

				next()
			})
			.catch(error => {
				req.token = undefined
				req.authError = error
				req.userPermissions = []
				req.user = {}
				next()
			})
		},
			graphqlHTTP(req => ({
				schema: Schema,
				graphiql: true,
				//Set to false if you don't want graphiql enabled,
				context: {
					token: req.token,
					authError: req.authError,
					user: req.user,
					userPermissions: req.userPermissions
				}
			}))
		)

		console.log('done loading routes')
	}

	private listen(): void {
		this.expressApp.listen(this.port, (err) => {
			if (err) throw err

			new SubscriptionServer({
				execute, subscribe, schema: Schema
			}, {
				server: this.expressServer,
				path: '/subscriptions'
			})

			return console.log(`server is listening on ${this.port}`)
		})
	}
}
