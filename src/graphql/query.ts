export default `
type Query {
    clients: [Client]
    users: [User]
    tokens: [Token]
    permissions: [Permission]
    roles: [Role]
    me: User
}
`
