export default `
input UserInput {
    email: String
    password: String
    roles: [String]
}

input RoleInput {
    name: String
    permissions: [String]
}

input PermissionInput {
    name: String
}

input ClientInput {
    clientId: String
    clientSecret: String
    grants: [String]
}
`