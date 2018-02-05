import * as mongoose from 'mongoose'

export const Permission = mongoose.model('permission', new mongoose.Schema({
	name: { type: String }
}))