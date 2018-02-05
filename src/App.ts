import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as expressOAuthServer from 'express-oauth-server'
import * as dataloader from 'dataloader'

var oauthServer = require('oauth2-server')
var Request = oauthServer.Request
var Response = oauthServer.Response

import * as Model from './oauthModelUtil'
import './db'

import { Schema } from './graphql/schema'

import * as graphqlHTTP from 'express-graphql'

export class App {
	private expressApp
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
	}
 
	public start() {
		this.loadRoutes()

		this.listen()
	}

	private loadRoutes():void {
		console.log('loading routes')

		this.expressApp.post('/oauth/token', this.oauthServer.token())

		this.expressApp.use('/', (req, res, next) => {
			this.oauthServer.server.authenticate(new Request(req), new Response(res))
			.then(token => {
				req.token = token
				next()
			})
			.catch(error => {
				req.token = null
				req.authError = error
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
