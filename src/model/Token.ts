import * as mongoose from 'mongoose'

export const Token = mongoose.model('token', new mongoose.Schema({
	accessToken: { type: String },
	accessTokenExpiresAt: { type: Date },
	client: { type: Object },
	clientId: { type: String },
	refreshToken: { type: String },
	refreshTokenExpiresAt: { type: Date },
	user: { type: Object },
	userId: { type: String }
}))