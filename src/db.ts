import * as mongoose from 'mongoose'

let portString = process.env.DB_PORT ? ':' + process.env.DB_PORT : ''

mongoose.connect(`mongodb://${process.env.DB_HOST || 'db'}${portString}/auth`, {
  useNewUrlParser: true
})