export default `
type Mutation {
    createClient(clientId: String!, clientSecret: String!): Client
    updateClient(id: String!, input: ClientInput!): Client
    deleteClient(id: String!): Client

    createUser(username: String!, email: String!, password: String!): User
    updateUser(id: ID!, input: UserInput!): User
    deleteUser(id: String!): User

    createPermission(name: String!): Permission
    updatePermission(id: String!, input: PermissionInput!): Permission
    deletePermissionByName(id: String!): Permission

    createRole(name: String!): Role
    updateRole(id: String!, input: RoleInput!): Role
    deleteRole(id: String!): Role

    registerTypeForPermissions(name: String!, fields: [String]!): [Permission]
}
`
