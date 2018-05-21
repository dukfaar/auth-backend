export default `
type Subscription {
    permissionCreated: Permission
    permissionUpdated: Permission
    permissionDeleted: Permission

    roleCreated: Role
    roleUpdated: Role
    roleDeleted: Role

    userCreated: User
    userUpdated: User
    userDeleted: User

    clientCreated: Client
    clientUpdated: Client
    clientDeleted: Client
}
`
