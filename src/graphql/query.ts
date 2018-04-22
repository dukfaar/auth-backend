export default `
type Query {
    clients: [Client]
    users: [User]
    tokens: [Token]
    permissions: [Permission]
    roles: [Role]
    me: User

    login(username: String!, password: String!, clientId: String!, clientSecret: String!): Token
    userByAccessToken(accessToken: String!): User
}
`
