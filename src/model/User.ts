import * as mongoose from 'mongoose'

export const User = mongoose.model('user', new mongoose.Schema({
	email: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true },
	roles: [{ type: String }]
}))