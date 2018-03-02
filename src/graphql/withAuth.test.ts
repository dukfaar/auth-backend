import { expect } from 'chai'

import withAuth from './withAuth'
import PermissionError from './PermissionError'

describe('withAuth', () => {
    let source = {
        userPermissions: [
            { name: 'testPermission1' },
            { name: 'testPermission2' }
        ]
    }

    it('calls the resolver if permission exists', () => {
        let authFunction = withAuth('testPermission1',() => true)
        expect(authFunction({}, {}, source, {})).to.be.equal(true)
    })

    it('throws an exception if permission is not given', () => {
        let authFunction = withAuth('testPermission7',() => true)
        expect(() => authFunction({}, {}, source, {})).to.throw(PermissionError)
    })
})