import * as mongoose from 'mongoose'

export const Client = mongoose.model('client', new mongoose.Schema({
	clientId: { type: String },
	clientSecret: { type: String },
	grants: [{ type: String }]
}))