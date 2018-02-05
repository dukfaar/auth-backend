import * as Promise from 'bluebird'

import { Token, Client, User } from './model'

export function getAccessToken(bearerToken) {
	return Token.findOne({ accessToken: bearerToken }).lean().exec()
}

export function getRefreshToken(refreshToken) {
	return Token.findOne({ refreshToken: refreshToken}).lean().exec()
}

export function getClient(id, secret) {
	return Client.findOne({ clientId: id, clientSecret: secret}).lean().exec()
}

export function getUser(username, password) {
	return User.findOne({ username: username, password: password}).lean().exec()
}

export function getUserFromClient(client) {
	return User.findOne({ username: client.clientId }).lean().exec()
}

export function saveToken(token, client, user) {
	let accessToken = new Token({
		accessToken: token.accessToken,
		accessTokenExpiresAt: token.accessTokenExpiresAt,
		client: client,
		clientId: client.clientId,
		refreshToken: token.refreshToken,
		refreshTokenExpiresAt: token.refreshTokenExpiresAt,
		user: user,
		userId: user._id
  	})
	return new Promise((resolve,reject) => {
		accessToken.save((err,data) => {
			if (err) reject(err)
			else resolve(data)
		})
	}).then((saveResult:any) => {
		saveResult = saveResult && typeof saveResult == 'object' ? saveResult.toJSON() : saveResult

		let data:any = {}
		for (var prop in saveResult) data[prop] = saveResult[prop]

		data.client = data.clientId
		data.user = data.userId

		return data
	})
}

export function revokeToken(token) {
	return Token.remove({ _id: token._id }).exec()
}
