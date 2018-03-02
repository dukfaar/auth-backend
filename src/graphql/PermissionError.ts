export default class PermissionError extends Error {
    message = this.message || 'Permission is missing'
}