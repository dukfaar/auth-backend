export default `
type Query {
    clients(first: Int, last: Int, after: ID, before: ID): ClientConnection
    users(first: Int, last: Int, after: ID, before: ID): UserConnection
    tokens(first: Int, last: Int, after: ID, before: ID): TokenConnection
    permissions(first: Int, last: Int, after: ID, before: ID): PermissionConnection
    roles(first: Int, last: Int, after: ID, before: ID): RoleConnection

    me: User

    login(username: String!, password: String!, clientId: String!, clientSecret: String!): Token
    refresh(refreshToken: String!, clientId: String!, clientSecret: String!): Token

    userByAccessToken(accessToken: String!): User

    user(id: ID!): User
    role(id: ID!): Role
}
`
