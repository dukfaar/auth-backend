export default `
type Client {
    _id: String!
    clientId: String
    clientSecret: String
    grants: [String]

    tokens: [Token]
}

type Permission {
    _id: String!
    name: String!
}

type Role {
    _id: String!
    name: String!

    permissions: [Permission]
}

type User {
    _id: String!
    username: String
    email: String

    tokens: [Token]

    roles: [Role]

    permissions: [Permission]
}

type Token {
    _id: String!
    clientId: String
    client: Client
    userId: String
    user: User
    accessToken: String
    refreshToken: String
    accessTokenExpiresAt: Date
    refreshTokenExpiresAt: Date
}
`