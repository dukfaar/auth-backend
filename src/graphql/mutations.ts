export default `
type Mutation {
    createClient(clientId: String!, clientSecret: String!): Client
    updateClient(clientId: String!, clientSecret: String, grants: [String]): Client
    deleteClient(clientId: String!): Client

    createUser(username: String!, email: String!, password: String!): User
    updateUser(username: String!, user: UserInput): User
    deleteUser(username: String!): User

    createPermission(name: String!): Permission
    updatePermission(name: String!, permission: PermissionInput): Permission
    deletePermission(name: String!): Permission

    createRole(name: String!): Role
    updateRole(name: String!, role: RoleInput): Role
    deleteRole(name: String!): Role
}
`
