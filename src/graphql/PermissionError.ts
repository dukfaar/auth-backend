export default class PermissionError extends Error {
    constructor(permission: string) {
        super()
        this.message = `Permission '${permission}' is missing`
    }
}