import types from './types'
import inputs from './inputs'
import query from './query'
import mutations from './mutations'

export default `
scalar Date

${inputs}

${types}

${query}

${mutations}
`