import { expect, chai } from 'chai'

import * as NodeCache from 'node-cache'

import fetchFromCache from './fetchFromCache'

describe('fetchFromCache Function', () => {
    it('first call fetches a new value', async () => {
        let cache = new NodeCache({stdTTL: 100, checkPeriod: 120})

        expect(await fetchFromCache(cache, 'testkey', (key) => { return 'testValue' })).to.be.equal('testValue')

    })
    it('second call doesnt fetch new value', async () => {
        let cache = new NodeCache({stdTTL: 100, checkPeriod: 120})

        let value1 = await fetchFromCache(cache ,'testkey', () => { 
            return 'testValue'
        })

        expect(await fetchFromCache(cache, 'testkey', (key) => { return 'wrongValue' })).to.be.equal('testValue')
    })
})