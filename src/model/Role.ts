import * as mongoose from 'mongoose'

export const Role = mongoose.model('role', new mongoose.Schema({
    name: { type: String },
    permissions: [{ type: String }]
}))