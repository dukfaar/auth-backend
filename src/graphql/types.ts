function createEdge(typename: string) {
    return `type ${typename}Edge { cursor:String! node:${typename} }\n`
}

function createConnection(typename: string) {
    return `type ${typename}Connection { edges:[${typename}Edge] pageInfo:PageInfo! }\n`
}

function relayTypes(typename: string) {
    return createEdge(typename) + ' ' + createConnection(typename)
}

export default `
interface Node {
    _id: ID!
}

type PageInfo {
    hasNextPage: Boolean
    hasPreviousPage: Boolean
    startCursor: String
    endCursor: String
}

type Client implements Node {
    _id: ID!
    clientId: String
    clientSecret: String
    grants: [String]

    tokens(first: Int, last: Int, after: ID, before: ID): TokenConnection
}

${relayTypes('Client')}

type Permission implements Node {
    _id: ID!
    name: String!
}

${relayTypes('Permission')}

type Role implements Node {
    _id: ID!
    name: String!

    permissions(first: Int, last: Int, after: ID, before: ID): PermissionConnection
}

${relayTypes('Role')}

type User implements Node {
    _id: ID!
    username: String
    email: String

    tokens(first: Int, last: Int, after: ID, before: ID): TokenConnection

    roles(first: Int, last: Int, after: ID, before: ID): RoleConnection

    permissions(first: Int, last: Int, after: ID, before: ID): PermissionConnection
}

${relayTypes('User')}

type Token implements Node  {
    _id: ID!
    clientId: String
    client: Client
    userId: String
    user: User
    accessToken: String
    refreshToken: String
    accessTokenExpiresAt: Date
    refreshTokenExpiresAt: Date
}

${relayTypes('Token')}
`