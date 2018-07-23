export default `
type Mutation {
    createClient(clientId: String!, clientSecret: String!): Client
    updateClient(id: ID!, input: ClientInput!): Client
    deleteClient(id: ID!): Client

    createUser(username: String!, email: String!, password: String!): User
    updateUser(id: ID!, input: UserInput!): User
    deleteUser(id: ID!): User

    createPermission(name: String!): Permission
    updatePermission(id: ID!, input: PermissionInput!): Permission
    deletePermissionByName(id: ID!): Permission

    createRole(name: String!): Role
    updateRole(id: ID!, input: RoleInput!): Role
    deleteRole(id: ID!): Role

    registerTypeForPermissions(name: String!, fields: [String]!): [Permission]
    registerQuery(name: String!): Permission
    registerMutation(name: String!): Permission
    registerSubscription(name: String!): Permission
}
`
